const AWS = require('aws-sdk');
const LOGGER = require('log4js').getLogger();

const RDS = new AWS.RDS({
  apiVersion: '2014-10-31',
  region: 'us-east-2',
});

LOGGER.level = 'debug';

/* GET EFS instances */
module.exports.describeTagsById = (req, res) => {
  RDS.listTagsForResource({
    ResourceName: req.params.id,
  }, (err, data) => {
    if (err) res.json(err, err.stack);// an error occurred
    else res.json(data.TagList); // successful response
  });
};

/* GET RDS DB instances */
module.exports.describe = (req, res) => {
  RDS.describeDBInstances({}, (err, data) => {
    if (err) {
      LOGGER.error(`[DESCRIBE-RDS]\n ${err.stack}`);
    } else if (data.DBInstances.length) {
      LOGGER.info(`[DESCRIBE-RDS]\n ${JSON.stringify(data.DBInstances, null, '\t')}`);
      res.json(data.DBInstances);
    } else {
      LOGGER.info('No rds data found.');
      res.json('No rds data');
    }
  });
};

module.exports.create = (req, res) => {
  const params = {
    DBInstanceClass: 'db.t2.micro',
    DBInstanceIdentifier: 'instance-test',
    Engine: 'postgres',
    EngineVersion: '9.6.5',
    AvailabilityZone: 'us-east-2a',
    DBName: 'db_test',
    MasterUsername: 'rdc',
    MasterUserPassword: 'password',
    AllocatedStorage: 20,
    Tags: [{
      Key: 'Context',
      Value: 'Test',
    }, {
      Key: 'Name',
      Value: 'Test-rdc',
    }],
  };
  RDS.createDBInstance(params, (err, data) => {
    if (err) res.json(err, err.stack); // an error occurred
    else res.json(`${data.DBInstance.DBInstanceIdentifier} created`);
  });
};

/* Terminate EFS Instances by id */
module.exports.terminateById = (req, res) => {
  const params = {
    DBInstanceIdentifier: req.params.id,
    SkipFinalSnapshot: true,
  };
  RDS.deleteDBInstance(params, (err, data) => {
    if (err) res.json(err, err.stack); // an error occurred
    else res.json(`${data.DBInstance.DBInstanceIdentifier} terminated`);
  });
};
