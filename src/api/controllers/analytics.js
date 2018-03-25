const AWS = require('aws-sdk');
const LOGGER = require('log4js').getLogger('analytics');
const moment = require('moment');

const CLOUD_WATCH = new AWS.CloudWatch({
  apiVersion: '2010-08-01',
  region: 'us-east-1',
});

LOGGER.level = 'info';

/* Analyze EC2 instances by id */
module.exports.analyzeById = (req, res) => {
  const params = {
    EndTime: new Date(),
    MetricName: 'CPUUtilization',
    Namespace: 'AWS/EC2',
    Period: 120,
    StartTime: new Date(moment().subtract(2, 'hours')),
    Dimensions: [{
      Name: 'InstanceId',
      Value: req.body.id,
    }],
    Statistics: [
      'Average',
    ],
    Unit: 'Percent',
  };

  CLOUD_WATCH.getMetricStatistics(params, (err, data) => {
    if (err) LOGGER.error(err);
    else res.json(data);
  });
};
