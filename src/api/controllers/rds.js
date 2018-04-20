/* eslint no-param-reassign:0 */
const AWS = require('aws-sdk');
const LOGGER = require('log4js').getLogger('RDS');
const ASYNC = require('async');
const UTILS = require('../config/utils');

LOGGER.level = 'info';

/* GET RDS DB instances */
module.exports.describe = (req, res) => {
  const rdsData = [];
  ASYNC.forEachOf(UTILS.regions, (awsRegion, i, callback) => {
    const RDS = new AWS.RDS({
      apiVersion: '2014-10-31',
      region: awsRegion,
    });

    RDS.describeDBInstances({}, (err, data) => {
      if (err) res.json(err);
      else if (data.DBInstances.length) {
        ASYNC.forEachOf(data.DBInstances, (dbInstance, j, tagCallback) => {
          RDS.listTagsForResource({
            ResourceName: dbInstance.DBInstanceArn,
          }, (tagerr, tagdata) => {
            dbInstance.Tags = tagdata.TagList;
            rdsData.push(dbInstance);

            tagCallback();
          });
        }, () => {
          callback();
        });
      } else {
        callback();
      }
    });
  }, () => {
    if (rdsData.length) res.json(rdsData);
    else res.json('No rds data');
  });
};

/* Terminate EFS Instances by id */
module.exports.terminateById = (req, res) => {
  const RDS = new AWS.RDS({
    apiVersion: '2014-10-31',
    region: req.query.region,
  });

  RDS.deleteDBInstance({
    DBInstanceIdentifier: req.query.id,
    SkipFinalSnapshot: true,
  }, (err, data) => {
    if (err) res.json(err);
    else {
      LOGGER.info(`${data.DBInstance.DBInstanceIdentifier} terminated`);
      res.json(`${data.DBInstance.DBInstanceIdentifier} terminated`);
    }
  });
};
