/** @module RDSController */
/* eslint no-param-reassign:0 */
const async = require('async');
const AWS = require('aws-sdk');
const config = require('../config/config');
const log = require('log4js').getLogger('RDS');

log.level = 'info';

/**
 * Route for describing RDS databases.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @returns {object} - All RDS data.
 */
module.exports.describe = (req, res) => {
  const rdsData = [];
  async.forEachOf(config.regions, (awsRegion, i, callback) => {
    const RDS = new AWS.RDS({
      apiVersion: '2014-10-31',
      region: awsRegion,
    });

    RDS.describeDBInstances({}, (err, data) => {
      if (err) res.json(err);
      else if (data.DBInstances.length) {
        async.forEachOf(data.DBInstances, (dbInstance, j, tagCallback) => {
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

/**
 * Route for terminating RDS database by id.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @param {req.query} region - The region of instance.
 * @param {req.query} id - The id of instance.
 * @returns {object} - Message that database is terminated.
 */
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
      log.info(`${data.DBInstance.DBInstanceIdentifier} terminated`);
      res.json(`${data.DBInstance.DBInstanceIdentifier} terminated`);
    }
  });
};
