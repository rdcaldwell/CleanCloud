/* eslint consistent-return:0 */
const AWS = require('aws-sdk');
const LOGGER = require('log4js').getLogger();
const ASYNC = require('async');

const EC2 = new AWS.EC2({
  apiVersion: '2016-11-15',
  region: 'us-east-1',
});

LOGGER.level = 'debug';

/* GET EC2 instances */
module.exports.describe = (req, res) => {
  EC2.describeInstances((err, data) => {
    if (err) {
      LOGGER.error(`[DESCRIBE-EC2]\n ${err.stack}`);
    } else if (data.Reservations.length) {
      res.json(data.Reservations);
    } else {
      res.json('No ec2 data');
    }
  });
};

/* Create EC2 Instance */
module.exports.create = (req, res) => {
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
      }],
    }],
  };

  // Create the instance
  EC2.runInstances(params, (err, data) => {
    if (err) LOGGER.error(err, err.stack);
    else {
      LOGGER.info(data);
      res.json(`${data.Instances[0].InstanceId} created`);
    }
  });
};

/* Terminate EC2 Instances by id */
module.exports.terminateById = (req, res) => {
  const InstanceValue = req.params.id;
  const instanceIds = [];
  instanceIds.push(InstanceValue);
  const params = {
    InstanceIds: instanceIds,
    DryRun: false,
  };
  // Create the instance
  EC2.terminateInstances(params, (err) => {
    if (err) res.json('Could not terminate instances', err);
    else res.json(`${InstanceValue} terminated`);
  });
};

module.exports.getContextById = (req, res) => {
  const params = {
    Filters: [{
      Name: 'tag-value',
      Values: [
        req.params.id,
      ],
    }],
  };
  EC2.describeInstances(params, (err, data) => {
    if (err) LOGGER.error(`[CONTEXT-EC2]\n ${err.stack}`);
    else if (data.Reservations.length) {
      res.json(data.Reservations);
    }
  });
};

module.exports.getContextNames = (req, res) => {
  const context = {
    names: [],
  };
  EC2.describeInstances((describeErr, data) => {
    if (describeErr) LOGGER.error(`[CONTEXT-NAMES-EC2]:\n ${describeErr.stack}`);
    else if (data.Reservations.length !== 0) {
      ASYNC.forEachOf(data.Reservations, (reservation, i, callback) => {
        ASYNC.forEachOf(reservation.Instances, (describedInstance) => {
          if (describedInstance.Tags.length) {
            ASYNC.forEachOf(describedInstance.Tags, (tag) => {
              if (tag.Key === 'Context' && context.names.indexOf(tag.Key) < 0) {
                context.names.push(tag.Value);
              }
            });
          }
        });
        callback();
      }, (loopErr) => {
        if (loopErr) LOGGER.error(loopErr);
        else res.json(context);
      });
    }
  });
};
