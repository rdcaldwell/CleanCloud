/** @module ClusterController */
/* eslint no-param-reassign:0, no-unused-vars: 0, consistent-return:0 */
const ASYNC = require('async');
const AWS = require('aws-sdk');
const LOGGER = require('log4js').getLogger('cluster');
const moment = require('moment');
const EMAIL_CONTROLLER = require('./email');
const JOB_CONTROLLER = require('./job');
const JANITOR_CONTROLLER = require('./janitor');
const Cluster = require('../models/cluster');
const UTILS = require('../config/utils');

LOGGER.level = 'info';

/**
 * Marks cluster for destruction, schedules destruction, and notifies owner via email.
 * @param {object} cluster - The cluster to be marked.
 */
const markCluster = (cluster) => {
  cluster.marked = true;
  LOGGER.info(`${cluster.context} marked`);
  JOB_CONTROLLER.scheduleJob(cluster.context, cluster.startedBy);
  EMAIL_CONTROLLER.emailStartedBy(cluster.context, cluster.startedBy, 'marked for destruction');
  cluster.jobIndex = JOB_CONTROLLER.jobs.length - 1;
  cluster.save();
};

/**
 * Finds and marks clusters that are running past the age threshold
 * @param {array} ids - Ids parsed from email.
module.exports.markClusters = () => {
  LOGGER.info('Janitor running');
  CLUSTER.find({
    marked: false,
    monitored: true,
  }, (err, clusters) => {
    ASYNC.forEachOf(clusters, (cluster) => {
      const threshold = new Date(moment(cluster.launchTime).add(1, 'minute'));
      if (new Date() > threshold) {
        markCluster(cluster);
      }
    });
  });
};
*/

/**
 * Finds and marks cluster from ids parsed from email.
 * @param {array} ids - Ids parsed from email.
 */
module.exports.markClustersFromEmail = (ids) => {
  Cluster.Model.find({
    marked: false,
  }, (err, clusters) => {
    ASYNC.forEachOf(clusters, (cluster) => {
      ASYNC.forEachOf(ids, (id) => {
        if (cluster.resourceIds.includes(id)) {
          markCluster(cluster);
        }
      });
    });
  });
};

/**
 * Route for getting all clusters.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @returns {object} - All clusters.
 */
module.exports.getClusters = (req, res) => {
  Cluster.Model.find({}, (err, clusters) => {
    if (err) res.json(err);
    else res.json(clusters);
  });
};

/**
 * Route for removing monitor tag from cluster after it has been opted out.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @returns {object} - Message that monitor has been removed.
 */
module.exports.removeClusterMonitor = (req, res) => {
  Cluster.Model.findOne({
    _id: req.params.id,
  }, (err, cluster) => {
    if (err) res.json(err);
    else {
      cluster.monitored = false;
      cluster.save();
      res.json('Monitor removed');
    }
  });
};

/**
 * Adds monitor tag from cluster after it has been opted in.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @returns {object} - Message that monitor has been added.
 */
module.exports.addClusterMonitor = (req, res) => {
  Cluster.Model.findOne({
    _id: req.params.id,
  }, (err, cluster) => {
    if (err) res.json(err);
    else {
      cluster.monitored = true;
      cluster.save();
      res.json('Monitor added');
    }
  });
};

/**
 * Removes clusters no longer in AWS from DB.
 */
module.exports.cleanClusterDB = () => {
  LOGGER.info('Cleaning up cluster DB');
  Cluster.Model.find({}, (err, clusters) => {
    if (err) LOGGER.error(err);
    else {
      ASYNC.forEachOf(clusters, (cluster) => {
        let isFound = false;
        const EC2 = new AWS.EC2({
          apiVersion: '2016-11-15',
          region: cluster.region,
        });

        EC2.describeTags({}, (tagerr, data) => {
          if (tagerr) LOGGER.error(tagerr);
          else {
            ASYNC.forEachOf(data.Tags, (tag, i, callback) => {
              if (tag.Value === cluster.context) isFound = true;
              callback();
            }, (looperr) => {
              if (!isFound) {
                Cluster.Model.findByIdAndRemove({
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

/**
 * Gets all cluster names.
 * @param {function} callback - Callback function with cluster names.
 */
const getClusterNames = (callback) => {
  const cluster = [];
  ASYNC.forEachOf(UTILS.regions, (awsRegion, i, regionCallback) => {
    const EC2 = new AWS.EC2({
      apiVersion: '2016-11-15',
      region: awsRegion,
    });

    EC2.describeInstances((describeErr, data) => {
      if (describeErr) LOGGER.error(describeErr);
      else if (data.Reservations.length !== 0) {
        ASYNC.forEachOf(data.Reservations, (reservation, index) => {
          ASYNC.forEachOf(reservation.Instances, (describedInstance) => {
            if (describedInstance.Tags.length) {
              const temp = {
                name: null,
                startedBy: null,
                region: null,
                launchTime: null,
              };

              ASYNC.forEachOf(describedInstance.Tags, (tag, j, tagCallback) => {
                if (tag.Key === 'Context' && cluster.indexOf(tag.Key) < 0) {
                  temp.name = tag.Value;
                  temp.region = describedInstance.Placement.AvailabilityZone.slice(0, -1);
                  temp.launchTime = describedInstance.LaunchTime;
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
        });
      }
      regionCallback();
    });
  }, () => {
    callback(cluster);
  });
};

/**
 * Gets all the EC2 instance ids associated with a cluster.
 * @param {string} name - The name of the cluster.
 * @param {string} region - The region of the cluster.
 * @param {function} callback - Callback function with resource ids.
 */
const getResourceIds = (name, region, callback) => {
  const resourceIds = [];
  const params = {
    Filters: [{
      Name: 'tag-value',
      Values: [name],
    }],
  };
  const EC2 = new AWS.EC2({
    apiVersion: '2016-11-15',
    region: region,
  });

  EC2.describeInstances(params, (ec2err, ec2data) => {
    if (ec2err) LOGGER.error(ec2err);
    else if (ec2data.Reservations.length) {
      ASYNC.forEachOf(ec2data.Reservations, (reservation, i, ec2callback) => {
        ASYNC.forEachOf(reservation.Instances, (instance) => {
          resourceIds.push(instance.InstanceId);
        });
        ec2callback();
      }, () => {
        callback(resourceIds);
      });
    }
  });
};

/**
 * Formulates cluster with all necessary data.
 * @param {object} cluster - The data of the cluster.
 * @param {function} callback - Callback function with formulated cluster.
 */
const formulateCluster = (cluster, callback) => {
  const contextData = {
    monkeyPort: null,
    monitored: false,
    marked: false,
    destroyed: false,
    destructionDate: null,
    jobIndex: null,
    resourceIds: [],
    context: cluster.name,
    startedBy: cluster.startedBy,
    region: cluster.region,
    launchTime: cluster.launchTime,
  };

  if (JANITOR_CONTROLLER.isJanitorRunning()) {
    JANITOR_CONTROLLER.addJanitorToClusters();
  }

  getResourceIds(cluster.name, cluster.region, (resourceIds) => {
    contextData.resourceIds = resourceIds;
    callback(contextData);
  });
};

/**
 * Adds clusters in AWS that are not in the DB.
 */
module.exports.setClusterDB = () => {
  LOGGER.info('Setting up cluster DB');
  getClusterNames((clusterData) => {
    ASYNC.forEachOf(clusterData, (clusterDatum) => {
      Cluster.Model.findOne({
        context: clusterDatum.name,
      }, (err, cluster) => {
        if (!cluster) {
          formulateCluster(clusterDatum, (contextData) => {
            const newCluster = new Cluster.Model();
            newCluster.context = contextData.context;
            newCluster.startedBy = contextData.startedBy;
            newCluster.monitored = contextData.monitored;
            newCluster.marked = contextData.marked;
            newCluster.destroyed = contextData.destroyed;
            newCluster.destructionDate = contextData.destructionDate;
            newCluster.jobIndex = contextData.jobIndex;
            newCluster.resourceIds = contextData.resourceIds;
            newCluster.monkeyPort = contextData.monkeyPort;
            newCluster.region = contextData.region;
            newCluster.launchTime = contextData.launchTime;
            newCluster.save();
            LOGGER.info(`${contextData.context} cluster added to db`);
          });
        }
      });
    });
  });
};
