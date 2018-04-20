/* eslint consistent-return:0 */
const AWS = require('aws-sdk');
const LOGGER = require('log4js').getLogger('EC2');
const ASYNC = require('async');
const UTILS = require('../config/utils');

LOGGER.level = 'info';

/* GET EC2 instances */
module.exports.describe = (req, res) => {
  const ec2Data = [];
  ASYNC.forEachOf(UTILS.regions, (awsRegion, i, callback) => {
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

/* Terminate EC2 Instances by id */
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
      LOGGER.info(`${InstanceValue} terminated`);
      res.json(`${InstanceValue} terminated`);
    }
  });
};

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

module.exports.getClusterNames = (req, res) => {
  const context = [];

  const params = {
    Filters: [{
      Name: 'key',
      Values: ['Context'],
    }],
  };

  ASYNC.forEachOf(UTILS.regions, (awsRegion, i, callback) => {
    const EC2 = new AWS.EC2({
      apiVersion: '2016-11-15',
      region: awsRegion,
    });

    EC2.describeTags(params, (err, data) => {
      if (err) res.json(err);
      else {
        ASYNC.forEachOf(data.Tags, (tag) => {
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
    if (regionErr) LOGGER.error(regionErr);
    else res.json(context);
  });
};
