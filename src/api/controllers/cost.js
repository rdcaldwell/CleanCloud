const AWS = require('aws-sdk');
const LOGGER = require('log4js').getLogger();
const moment = require('moment');

const COST_EXPLORER = new AWS.CostExplorer({
  apiVersion: '2017-10-25',
  region: 'us-east-1',
});

LOGGER.level = 'debug';

module.exports.getCostByName = (req, res) => {
  let service = '';
  switch (req.body.service) {
    case 'ec2':
      service = 'Amazon Elastic Compute Cloud - Compute';
      break;
    case 'rds':
      service = 'Amazon Elastic File System';
      break;
    case 'efs':
      service = 'Amazon Relational Database Service';
      break;
    default:
      res.json('Invalid service');
  }
  const params = {
    Metrics: [
      'BlendedCost',
    ],
    Granularity: 'MONTHLY',
    Filter: {
      Dimensions: {
        Key: 'SERVICE',
        Values: [
          service,
        ],
      },
      Tags: {
        Key: 'Name',
        Values: [
          req.body.name,
        ],
      },
    },
    TimePeriod: {
      End: moment().format('YYYY-MM-DD'),
      Start: moment(req.body.creationDate).format('YYYY-MM-DD'),
    },
  };
  COST_EXPLORER.getCostAndUsage(params, (err, data) => {
    if (err) res.json(err, err.stack); // an error occurred
    else res.json(data); // successful response
  });
};

module.exports.getCostByContext = (req, res) => {
  const params = {
    Metrics: [
      'BlendedCost',
    ],
    Granularity: 'MONTHLY',
    Filter: {
      Tags: {
        Key: 'Context',
        Values: [
          req.body.context,
        ],
      },
    },
    TimePeriod: {
      End: moment().format('YYYY-MM-DD'),
      Start: moment(req.body.creationDate).format('YYYY-MM-DD'),
    },
  };
  COST_EXPLORER.getCostAndUsage(params, (err, data) => {
    if (err) res.json(err, err.stack); // an error occurred
    else res.json(data); // successful response
  });
};

module.exports.getContextTags = (req, res) => {
  const params = {
    TimePeriod: {
      End: moment().format('YYYY-MM-DD'),
      Start: '2018-02-01',
    },
  };
  COST_EXPLORER.getTags(params, (err, data) => {
    if (err) res.json(err, err.stack);
    else res.json(data);
  });
};
