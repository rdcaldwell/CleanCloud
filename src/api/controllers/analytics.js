const AWS = require('aws-sdk');
const LOGGER = require('log4js').getLogger();

const CLOUD_WATCH = new AWS.CloudWatch({
  apiVersion: '2010-08-01',
  region: 'us-east-1',
});

LOGGER.level = 'debug';

/* Analyze EC2 instances by id */
module.exports.analyzeById = (req, res) => {
  const params = {
    EndTime: new Date(),
    MetricName: 'CPUUtilization',
    Namespace: 'AWS/EC2',
    Period: 120,
    StartTime: new Date('March 15, 2018 19:30:00'),
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
    else res.json(data);
  });
};
