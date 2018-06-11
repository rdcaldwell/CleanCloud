/** @module EC2Controller */
/* eslint consistent-return:0 */
const async = require('async');
const AWS = require('aws-sdk');
const config = require('../config/config');
const log = require('log4js').getLogger('EC2');

log.level = 'info';

/**
 * Route for describing EC2 instances.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @returns {object} - All EC2 data.
 */
module.exports.describe = (req, res) => {
  const ec2Data = [];
  async.forEachOf(config.regions, (awsRegion, i, callback) => {
    const EC2 = new AWS.EC2({
      apiVersion: '2016-11-15',
      region: awsRegion,
    });

    EC2.describeInstances((err, data) => {
      if (err) res.json(err);
      else if (data.Reservations.length) {
        ec2Data.push(...data.Reservations);
      }

      callback();
    });
  }, () => {
    if (ec2Data.length) res.json(ec2Data);
    else res.json('No ec2 data');
  });
};

/**
 * Route for terminating EC2 instances by id.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @param {req.query} region - The region of instance
 * @param {req.query} id - The id of instance.
 * @returns {object} - Message that instance is terminated.
 */
module.exports.terminateById = (req, res) => {
  const EC2 = new AWS.EC2({
    apiVersion: '2016-11-15',
    region: req.query.region,
  });

  const InstanceValue = req.query.id;
  const instanceIds = [];
  instanceIds.push(InstanceValue);
  const params = {
    InstanceIds: instanceIds,
    DryRun: false,
  };
  // Create the instance
  EC2.terminateInstances(params, (err) => {
    if (err) res.json(err);
    else {
      log.info(`${InstanceValue} terminated`);
      res.json(`${InstanceValue} terminated`);
    }
  });
};

/**
 * Route for getting cluster data by its Context tag.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @returns {object} - Cluster data matching Context tag.
 */
module.exports.getContextById = (req, res) => {
  const EC2 = new AWS.EC2({
    apiVersion: '2016-11-15',
    region: req.query.region,
  });

  const params = {
    Filters: [{
      Name: 'tag-value',
      Values: [
        req.query.id,
      ],
    }],
  };

  EC2.describeInstances(params, (err, data) => {
    if (err) res.json(err);
    else if (data.Reservations.length) {
      res.json(data.Reservations);
    }
  });
};

/**
 * Route for getting all cluster names.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @returns {object} - All cluster names.
 */
module.exports.getClusterNames = (req, res) => {
  const context = [];

  const params = {
    Filters: [{
      Name: 'key',
      Values: ['Context'],
    }],
  };

  async.forEachOf(config.regions, (awsRegion, i, callback) => {
    const EC2 = new AWS.EC2({
      apiVersion: '2016-11-15',
      region: awsRegion,
    });

    EC2.describeTags(params, (err, data) => {
      if (err) res.json(err);
      else {
        async.forEachOf(data.Tags, (tag) => {
          if (tag.Key === 'Context' && context.indexOf(tag.Key) < 0) {
            context.push({
              name: tag.Value,
              region: awsRegion,
            });
          }
        });
      }

      callback();
    });
  }, (regionErr) => {
    if (regionErr) log.error(regionErr);
    else res.json(context);
  });
};
