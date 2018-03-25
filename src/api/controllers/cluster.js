/* eslint no-param-reassign:0, no-unused-vars: 0, consistent-return:0 */
const ASYNC = require('async');
const AWS = require('aws-sdk');
const LOGGER = require('log4js').getLogger('cluster');
const mongoose = require('mongoose');
const EMAIL_CONTROLLER = require('./email');
const JOB_CONTROLLER = require('./job');

const CLUSTER = mongoose.model('Cluster');
const JANITOR = mongoose.model('Janitor');

const EC2 = new AWS.EC2({
  apiVersion: '2016-11-15',
  region: 'us-east-1',
});

LOGGER.level = 'info';

module.exports.findClusters = (ids) => {
  CLUSTER.find({}, (err, clusters) => {
    ASYNC.forEachOf(clusters, (cluster) => {
      if (!cluster.marked) {
        ASYNC.forEachOf(ids, (id) => {
          if (cluster.resourceIds.includes(id)) {
            LOGGER.debug(cluster);
            cluster.marked = true;
            LOGGER.info(`${cluster.context} marked`);
            JOB_CONTROLLER.scheduleJob(cluster.context, cluster.startedBy);
            EMAIL_CONTROLLER.emailStartedBy(cluster.context, cluster.startedBy, 'marked for destruction');
            cluster.jobIndex = JOB_CONTROLLER.jobs.length - 1;
            cluster.save();
          }
        });
      }
    });
  });
};

module.exports.getClusters = (req, res) => {
  CLUSTER.find({}, (err, clusters) => {
    if (err) res.json(err);
    else res.json(clusters);
  });
};

module.exports.cleanClusterDB = () => {
  LOGGER.info('Cleaning up cluster DB');
  CLUSTER.find({}, (err, clusters) => {
    if (err) LOGGER.error(err);
    else {
      ASYNC.forEachOf(clusters, (cluster) => {
        let isFound = false;
        EC2.describeTags({}, (tagerr, data) => {
          if (tagerr) LOGGER.info(tagerr);
          else {
            ASYNC.forEachOf(data.Tags, (tag, i, callback) => {
              if (tag.Value === cluster.context) isFound = true;
              callback();
            }, (looperr) => {
              if (!isFound) {
                CLUSTER.findByIdAndRemove({
                  _id: cluster._id,
                }, (founderr) => {
                  if (founderr) LOGGER.error(founderr);
                  else LOGGER.info(`${cluster.context} removed from db`);
                });
              }
            });
          }
        });
      });
    }
  });
};

module.exports.setClusterDB = () => {
  LOGGER.info('Setting up cluster DB');
  const namesPromise = new Promise((resolve, reject) => {
    const cluster = [];
    EC2.describeInstances((describeErr, data) => {
      if (describeErr) LOGGER.error(describeErr);
      else if (data.Reservations.length !== 0) {
        ASYNC.forEachOf(data.Reservations, (reservation, index, callback) => {
          ASYNC.forEachOf(reservation.Instances, (describedInstance) => {
            if (describedInstance.Tags.length) {
              const temp = {
                name: null,
                startedBy: null,
                region: null,
              };
              ASYNC.forEachOf(describedInstance.Tags, (tag, j, tagCallback) => {
                if (tag.Key === 'Context' && cluster.indexOf(tag.Key) < 0) {
                  temp.name = tag.Value;
                  temp.region = describedInstance.Placement.AvailabilityZone.slice(0, -1);
                } else if (tag.Key === 'startedBy') {
                  temp.startedBy = tag.Value;
                }
                tagCallback();
              }, (tagErr) => {
                if (temp.name !== null) {
                  cluster.push(temp);
                }
              });
            }
          });
          callback();
        }, (loopErr) => {
          resolve(cluster);
        });
      }
    });
  });

  namesPromise.then((clusterData) => {
    ASYNC.forEachOf(clusterData, (clusterDatum) => {
      CLUSTER.findOne({
        context: clusterDatum.name,
      }, (err, cluster) => {
        const contextDataPromise = new Promise((resolve, reject) => {
          if (cluster === null) {
            const contextData = {
              monkeyPort: null,
              monitored: null,
              marked: null,
              destroyed: false,
              destructionDate: null,
              jobIndex: null,
              resourceIds: [],
              name: clusterDatum.name,
              startedBy: clusterDatum.startedBy,
              region: clusterDatum.region,
            };

            JANITOR.findOne({
              region: clusterDatum.region,
            }, (janitorerr, janitor) => {
              if (janitorerr) LOGGER.error(janitorerr);
              else if (janitor) {
                contextData.monkeyPort = janitor.port;
                contextData.monitored = true;
                contextData.marked = false;
              }
            });

            const params = {
              Filters: [{
                Name: 'tag-value',
                Values: [clusterDatum.name],
              }],
            };

            EC2.describeInstances(params, (ec2err, ec2data) => {
              if (ec2err) LOGGER.error(ec2err);
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

        contextDataPromise.then((contextData) => {
          const newCluster = new CLUSTER();
          newCluster.context = contextData.name;
          newCluster.startedBy = contextData.startedBy;
          newCluster.monitored = contextData.monitored;
          newCluster.marked = contextData.marked;
          newCluster.destroyed = contextData.destroyed;
          newCluster.destructionDate = contextData.destructionDate;
          newCluster.jobIndex = contextData.jobIndex;
          newCluster.resourceIds = contextData.resourceIds;
          newCluster.monkeyPort = contextData.monkeyPort;
          newCluster.region = contextData.region;
          newCluster.save();
          LOGGER.info(`${contextData.name} cluster added to db`);
        }).catch(() => {
          LOGGER.info('Cluster already exists');
        });
      });
    });
  });
};
