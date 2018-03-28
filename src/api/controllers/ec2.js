/* eslint consistent-return:0 */
const AWS = require('aws-sdk');
const LOGGER = require('log4js').getLogger('EC2');
const ASYNC = require('async');

LOGGER.level = 'info';

/* GET EC2 instances */
module.exports.describe = (req, res) => {
  const EC2 = new AWS.EC2({
    apiVersion: '2016-11-15',
    region: 'us-east-1',
  });

  EC2.describeInstances((err, data) => {
    if (err) res.json(err);
    else if (data.Reservations.length) {
      res.json(data.Reservations);
    } else {
      res.json('No ec2 data');
    }
  });
};

/* Create EC2 Instance */
module.exports.create = (req, res) => {
  const EC2 = new AWS.EC2({
    apiVersion: '2016-11-15',
    region: 'us-east-1',
  });

  const params = {
    ImageId: 'ami-1853ac65', // amzn-ami-2011.09.1.x86_64-ebs
    InstanceType: 't2.micro',
    MinCount: 1,
    MaxCount: 1,
    TagSpecifications: [{
      ResourceType: 'instance',
      Tags: [{
        Key: 'Context',
        Value: 'Test',
      }, {
        Key: 'Name',
        Value: 'Test-rdc',
      }, {
        Key: 'startedBy',
        Value: 'rdc',
      }],
    }],
  };

  // Create the instance
  EC2.runInstances(params, (err, data) => {
    if (err) res.json(err);
    else {
      LOGGER.info(`${data.Instances[0].InstanceId} created`);
      res.json(`${data.Instances[0].InstanceId} created`);
    }
  });
};

/* Terminate EC2 Instances by id */
module.exports.terminateById = (req, res) => {
  const EC2 = new AWS.EC2({
    apiVersion: '2016-11-15',
    region: 'us-east-1',
  });

  const InstanceValue = req.params.id;
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
    region: 'us-east-1',
  });

  const params = {
    Filters: [{
      Name: 'tag-value',
      Values: [
        req.params.id,
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
  const EC2 = new AWS.EC2({
    apiVersion: '2016-11-15',
    region: 'us-east-1',
  });

  const context = {
    names: [],
  };
  const params = {
    Filters: [{
      Name: 'key',
      Values: ['Context'],
    }],
  };
  EC2.describeTags(params, (err, data) => {
    if (err) res.json(err);
    else {
      ASYNC.forEachOf(data.Tags, (tag, i, callback) => {
        if (tag.Key === 'Context' && context.names.indexOf(tag.Key) < 0) {
          context.names.push(tag.Value);
        }
        callback();
      }, (loopErr) => {
        if (loopErr) LOGGER.error(loopErr);
        else res.json(context);
      });
    }
  });
};
