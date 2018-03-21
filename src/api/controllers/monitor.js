/* eslint no-param-reassign:0, no-unused-vars: 0, consistent-return:0 */
const htmlToText = require('html-to-text');
const schedule = require('node-schedule');
const ASYNC = require('async');
const AWS = require('aws-sdk');
const LOGGER = require('log4js').getLogger();
const mongoose = require('mongoose');
const MailListener = require('mail-listener2');
const JENKINS_CONTROLLER = require('../controllers/jenkins');
const EC2_CONTROLLER = require('../controllers/ec2');

const CLUSTER = mongoose.model('Cluster');

const mailListener = new MailListener({
  username: process.env.IMAP_EMAIL,
  password: process.env.IMAP_PASSWORD,
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  connTimeout: 10000,
  authTimeout: 5000,
  tlsOptions: {
    rejectUnauthorized: false,
  },
  mailbox: 'INBOX',
  searchFilter: ['UNSEEN'],
  markSeen: true,
  fetchUnreadOnStart: true,
});
const SES = new AWS.SES({
  apiVersion: '2010-12-01',
  region: 'us-east-1',
});
const EC2 = new AWS.EC2({
  apiVersion: '2016-11-15',
  region: 'us-east-1',
});
const jobs = [];

function openInbox(cb) {
  mailListener.imap.openBox('INBOX', true, cb);
}

function emailStartedBy(clusterName, message) {
  const params = {
    Destination: {
      BccAddresses: [],
      CcAddresses: [],
      ToAddresses: [
        'rdcaldwell5705@eagle.fgcu.edu',
      ],
    },
    Message: {
      Body: {
        Html: {
          Data: `${clusterName} has been ${message}`,
          Charset: 'UTF-8',
        },
        Text: {
          Data: `${clusterName} has been ${message}`,
          Charset: 'UTF-8',
        },
      },
      Subject: {
        Data: `${clusterName} has been ${message} by CleanCloud`,
        Charset: 'UTF-8',
      },
    },
    Source: 'cloudianapp@gmail.com',
  };
  SES.sendEmail(params, (err, data) => {
    if (err) LOGGER.info(err, err.stack);
    else LOGGER.info(data);
  });
}

function scheduleJob(name) {
  const today = new Date();
  const destructionTime = new Date();
  destructionTime.setDate(today.getDate() + 1);

  CLUSTER.findOne({
    context: name,
  }, (err, cluster) => {
    cluster.destructionDate = destructionTime;
    cluster.save();
  });
  const job = (schedule.scheduleJob(destructionTime, () => {
    JENKINS_CONTROLLER.destroyByName(name);
    emailStartedBy(name, 'destroyed');
  }));
  LOGGER.info(`Job scheduled ${destructionTime}`);
}

function findClusters(ids) {
  CLUSTER.find({}, (err, clusters) => {
    ASYNC.forEachOf(clusters, (cluster) => {
      if (!cluster.marked) {
        ASYNC.forEachOf(ids, (id) => {
          if (cluster.resourceIds.includes(id)) {
            cluster.marked = true;
            LOGGER.info(`${cluster.context} marked!`);
            scheduleJob(cluster.context);
            emailStartedBy(cluster.context, 'marked for destruction');
            cluster.jobIndex = jobs.length - 1;
            cluster.save();
          }
        });
      }
    });
  });
}

module.exports.cancelJob = (req, res) => {
  CLUSTER.findOne({
    context: req.params.id,
  }, (err, cluster) => {
    jobs[cluster.jobIndex].cancel();
    cluster.marked = false;
    cluster.jobIndex = null;
    cluster.destructionDate = null;
    cluster.save();
    LOGGER.info(`${cluster.context} job canceled`);
  });
};

module.exports.getClusters = (req, res) => {
  CLUSTER.find({}, (err, clusters) => {
    if (err) res.json(err);
    else res.json(clusters);
  });
};

module.exports.startMonitor = () => {
  mailListener.start();
};

mailListener.on('mail', () => {
  LOGGER.info('Parsing new email');
  openInbox((err, box) => {
    if (err) throw err;
    const f = mailListener.imap.seq.fetch(`${box.messages.total}:*`, {
      bodies: ['TEXT'],
    });
    f.on('message', (msg) => {
      msg.on('body', (stream) => {
        let buffer = '';
        stream.on('data', (chunk) => {
          buffer += chunk.toString('utf8');
        });
        stream.once('end', () => {
          const ids = htmlToText.fromString(buffer.toString()).trim().split(',');
          findClusters(ids);
        });
      });
    });
  });
});

module.exports.setupClusterDB = () => {
  LOGGER.info('Setting up cluster DB');
  const getContextNames = new Promise((resolve, reject) => {
    const contextNames = [];
    EC2.describeInstances((describeErr, data) => {
      if (describeErr) LOGGER.error(`[CONTEXT-NAMES-EC2]:\n ${describeErr.stack}`);
      else if (data.Reservations.length !== 0) {
        ASYNC.forEachOf(data.Reservations, (reservation, index, callback) => {
          ASYNC.forEachOf(reservation.Instances, (describedInstance) => {
            if (describedInstance.Tags.length) {
              ASYNC.forEachOf(describedInstance.Tags, (tag) => {
                if (tag.Key === 'Context' && contextNames.indexOf(tag.Key) < 0) {
                  contextNames.push(tag.Value);
                }
              });
            }
          });
          callback();
        }, (loopErr) => {
          resolve(contextNames);
        });
      }
    });
  });

  getContextNames.then((contextNames) => {
    ASYNC.forEachOf(contextNames, (name) => {
      CLUSTER.findOne({
        context: name,
      }, (err, cluster) => {
        const getContextData = new Promise((resolve, reject) => {
          if (cluster === null) {
            const contextData = {
              monkeyPort: 8080,
              monitored: true,
              marked: null,
              destructionDate: null,
              jobIndex: null,
              resourceIds: [],
              name: name,
              startedBy: 'rdc',
            };

            const params = {
              Filters: [{
                Name: 'tag-value',
                Values: [
                  name,
                ],
              }],
            };

            EC2.describeInstances(params, (ec2err, ec2data) => {
              if (ec2err) LOGGER.error(`[CONTEXT-EC2]\n ${ec2err.stack}`);
              else if (ec2data.Reservations.length) {
                ec2data.Reservations.forEach((reservation) => {
                  reservation.Instances.forEach((instance) => {
                    contextData.resourceIds.push(instance.InstanceId);
                  });
                });
                resolve(contextData);
              }
            });
          } else {
            reject(Error('Cluster exists'));
          }
        });

        getContextData.then((contextData) => {
          const newCluster = new CLUSTER();
          newCluster.context = contextData.name;
          newCluster.startedBy = contextData.startedBy;
          newCluster.monitored = contextData.monitored;
          newCluster.marked = contextData.marked;
          newCluster.destructionDate = contextData.destructionDate;
          newCluster.jobIndex = contextData.jobIndex;
          newCluster.resourceIds = contextData.resourceIds;
          newCluster.monkeyPort = contextData.monkeyPort;
          newCluster.save();
        }).catch(() => {
          LOGGER.info('Cluster already exists');
        });
      });
    });
  });
};

mailListener.on('server:connected', () => {
  LOGGER.info('Monitor listening');
});

mailListener.on('server:disconnected', () => {
  LOGGER.info('Monitor disconnected');
});

mailListener.on('error', (err) => {
  LOGGER.info(err);
});
