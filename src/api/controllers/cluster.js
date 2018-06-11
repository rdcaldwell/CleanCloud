/** @module ClusterController */
/* eslint no-param-reassign:0, no-unused-vars: 0, consistent-return:0 */
const async = require('async');
const AWS = require('aws-sdk');
const Cluster = require('../models/cluster');
const config = require('../config/config');
const log = require('log4js').getLogger('cluster');

log.level = 'info';

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
 * Removes clusters no longer in AWS from DB.
 */
module.exports.cleanClusterDB = () => {
  log.info('Cleaning up cluster DB');
  Cluster.Model.find({}, (err, clusters) => {
    if (err) log.error(err);
    else {
      async.forEachOf(clusters, (cluster) => {
        let isFound = false;
        const EC2 = new AWS.EC2({
          apiVersion: '2016-11-15',
          region: cluster.region,
        });

        EC2.describeTags({}, (tagerr, data) => {
          if (tagerr) log.error(tagerr);
          else {
            async.forEachOf(data.Tags, (tag, i, callback) => {
              if (tag.Value === cluster.context) isFound = true;
              callback();
            }, (looperr) => {
              if (!isFound) {
                Cluster.Model.findByIdAndRemove({
                  _id: cluster._id,
                }, (founderr) => {
                  if (founderr) log.error(founderr);
                  else log.info(`${cluster.context} removed from db`);
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
  async.forEachOf(config.regions, (awsRegion, i, regionCallback) => {
    const EC2 = new AWS.EC2({
      apiVersion: '2016-11-15',
      region: awsRegion,
    });

    EC2.describeInstances((describeErr, data) => {
      if (describeErr) log.error(describeErr);
      else if (data.Reservations.length !== 0) {
        async.forEachOf(data.Reservations, (reservation, index) => {
          async.forEachOf(reservation.Instances, (describedInstance) => {
            if (describedInstance.Tags.length) {
              const temp = {
                name: null,
                startedBy: null,
                region: null,
                launchTime: null,
              };

              async.forEachOf(describedInstance.Tags, (tag, j, tagCallback) => {
                if (tag.Key === 'Context' && cluster.indexOf(tag.Key) < 0) {
                  temp.name = tag.Value;
                  temp.region = describedInstance.Placement.AvailabilityZone.slice(0, -1);
                  temp.launchTime = describedInstance.LaunchTime;
                } else if (tag.Key === 'StartedBy') {
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
    if (ec2err) log.error(ec2err);
    else if (ec2data.Reservations.length) {
      async.forEachOf(ec2data.Reservations, (reservation, i, ec2callback) => {
        async.forEachOf(reservation.Instances, (instance) => {
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
    monitored: true,
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

  getResourceIds(cluster.name, cluster.region, (resourceIds) => {
    contextData.resourceIds = resourceIds;
    callback(contextData);
  });
};

/**
 * Adds clusters in AWS that are not in the DB.
 */
module.exports.setClusterDB = () => {
  log.info('Setting up cluster DB');
  getClusterNames((clusterData) => {
    async.forEachOf(clusterData, (clusterDatum) => {
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
            log.info(`${contextData.context} cluster added to db`);
          });
        }
      });
    });
  });
};
