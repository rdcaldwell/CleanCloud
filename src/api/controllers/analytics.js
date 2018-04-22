/** @module AnalyticsController */
const AWS = require('aws-sdk');
const LOGGER = require('log4js').getLogger('analytics');
const moment = require('moment');

LOGGER.level = 'info';

/**
 * Route for analyzing CPU Utilizaton of EC2 instances by id.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @param {req.query} region - The region of instance.
 * @param {req.query} id - The id of instance.
 * @returns {object} - CPU Utilization CloudWatch metrics of instance.
 */
module.exports.analyzeById = (req, res) => {
  const CLOUD_WATCH = new AWS.CloudWatch({
    apiVersion: '2010-08-01',
    region: req.query.region,
  });

  // CPU Utilization for last 2 running hours
  const params = {
    EndTime: new Date(),
    MetricName: 'CPUUtilization',
    Namespace: 'AWS/EC2',
    Period: 120,
    StartTime: new Date(moment().subtract(2, 'hours')),
    Dimensions: [{
      Name: 'InstanceId',
      Value: req.query.id,
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
