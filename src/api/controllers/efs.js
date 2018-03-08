const AWS = require('aws-sdk');
const LOGGER = require('log4js').getLogger();

const EFS = new AWS.EFS({
  apiVersion: '2015-02-01',
  region: 'us-east-2',
});

LOGGER.level = 'debug';

/* GET EFS instances */
module.exports.describe = (req, res) => {
  EFS.describeFileSystems({}, (err, data) => {
    if (err) {
      LOGGER.error(`[DESCRIBE-EFS]\n ${err.stack}`);
    } else if (data.FileSystems.length) {
      LOGGER.info(`DESCRIBE-EFS]\n ${JSON.stringify(data.FileSystems, null, '\t')}`);
      res.json(data.FileSystems);
    } else {
      LOGGER.info('No efs data found.');
      res.json('No efs data');
    }
  });
};

/* Create EFS instance */
module.exports.create = (req, res) => {
  const params = {
    CreationToken: 'tokenstring',
    PerformanceMode: 'generalPurpose',
  };
  EFS.createFileSystem(params, (err, data) => {
    if (err) res.json(err, err.stack); // an error occurred
    else LOGGER.info(`[CREATE-EFS]\n ${JSON.stringify(data, null, '\t')}`); // successful response
    const tagParams = {
      FileSystemId: data.FileSystemId,
      Tags: [{
        Key: 'Context',
        Value: 'Test',
      }, {
        Key: 'Name',
        Value: 'Test-rdc',
      }],
    };
    EFS.createTags(tagParams, (tagErr, tagData) => {
      if (tagErr) res.json(tagErr, tagErr.stack); // an error occurred
      else res.json(tagData); // successful response
    });
  });
};

/* Terminate EFS Instances by id */
module.exports.terminateById = (req, res) => {
  const params = {
    FileSystemId: req.params.id,
  };
  EFS.deleteFileSystem(params, (err, data) => {
    if (err) res.json(err, err.stack); // an error occurred
    else res.json(data); // successful response
  });
};

/* GET EFS instances */
module.exports.describeTagsById = (req, res) => {
  EFS.describeTags({
    FileSystemId: req.params.id,
  }, (err, data) => {
    if (err) res.json(err, err.stack); // an error occurred
    else res.json(data.Tags); // successful response
  });
};
