const AWS = require('aws-sdk');
const LOGGER = require('log4js').getLogger('RDS');

LOGGER.level = 'info';

/* GET EFS instances */
module.exports.describeTagsById = (req, res) => {
  const RDS = new AWS.RDS({
    apiVersion: '2014-10-31',
    region: 'us-east-2',
  });
  RDS.listTagsForResource({
    ResourceName: req.params.id,
  }, (err, data) => {
    if (err) res.json(err);
    else res.json(data.TagList);
  });
};

/* GET RDS DB instances */
module.exports.describe = (req, res) => {
  const RDS = new AWS.RDS({
    apiVersion: '2014-10-31',
    region: 'us-east-2',
  });
  RDS.describeDBInstances({}, (err, data) => {
    if (err) res.json(err);
    else if (data.DBInstances.length) {
      res.json(data.DBInstances);
    } else {
      res.json('No rds data');
    }
  });
};

/* Terminate EFS Instances by id */
module.exports.terminateById = (req, res) => {
  const RDS = new AWS.RDS({
    apiVersion: '2014-10-31',
    region: 'us-east-2',
  });
  const params = {
    DBInstanceIdentifier: req.params.id,
    SkipFinalSnapshot: true,
  };
  RDS.deleteDBInstance(params, (err, data) => {
    if (err) res.json(err);
    else res.json(`${data.DBInstance.DBInstanceIdentifier} terminated`);
  });
};
