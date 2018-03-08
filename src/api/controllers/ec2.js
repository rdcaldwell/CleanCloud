const AWS = require('aws-sdk');
const LOGGER = require('log4js').getLogger();
const ASYNC = require('async');

const EC2 = new AWS.EC2({
  apiVersion: '2016-11-15',
  region: 'us-west-2',
});
const CLOUD_WATCH = new AWS.CloudWatch({
  apiVersion: '2010-08-01',
  region: 'us-west-2',
});

LOGGER.level = 'debug';

/* GET EC2 instances */
module.exports.describe = (req, res) => {
  EC2.describeInstances((err, data) => {
    if (err) {
      LOGGER.error(`[DESCRIBE-EC2]\n ${err.stack}`);
    } else if (data.Reservations.length) {
      LOGGER.info(data.Reservations);
      res.json(data.Reservations);
    } else {
      LOGGER.info('No ec2 data found.');
      res.json('No ec2 data');
    }
  });
};

/* Create EC2 Instance */
module.exports.create = (req, res) => {
  const params = {
    ImageId: 'ami-10fd7020', // amzn-ami-2011.09.1.x86_64-ebs
    InstanceType: 't1.micro',
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
      res.json(data.Instances[0]);
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

/* Analyze EC2 instances by id */
module.exports.analyzeById = (req, res) => {
  const params = {
    EndTime: new Date(),
    MetricName: 'CPUUtilization',
    Namespace: 'AWS/EC2',
    Period: 120,
    StartTime: new Date('February 07, 2018 03:24:00'),
    Dimensions: [{
      Name: 'InstanceId',
      Value: req.params.id,
    }],
    Statistics: [
      'Average',
    ],
    Unit: 'Percent',
  };
  CLOUD_WATCH.getMetricStatistics(params, (err, data) => {
    if (err) LOGGER.error(err, err.stack); // an error occurred
    else {
      LOGGER.info(JSON.stringify(data, null, '\t')); // successful response
      res.json(data);
    }
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
      res.json(data.Reservations[0].Instances);
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
      ASYNC.forEachOf(data.Reservations[0].Instances, (describedInstance, index, callback) => {
        if (describedInstance.Tags.length &&
              context.names.indexOf(describedInstance.Tags[1].Value) < 0) {
          context.names.push(describedInstance.Tags[1].Value);
        }
        callback();
      }, (loopErr) => {
        if (loopErr) LOGGER.error(loopErr);
        else res.json(context);
      });
    }
  });
};
