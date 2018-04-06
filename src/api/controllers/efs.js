const AWS = require('aws-sdk');
const LOGGER = require('log4js').getLogger('EFS');

const EFS = new AWS.EFS({
  apiVersion: '2015-02-01',
  region: 'us-east-1',
});

LOGGER.level = 'info';

/* GET EFS instances */
module.exports.describe = (req, res) => {
  EFS.describeFileSystems({}, (err, data) => {
    if (err) {
      LOGGER.error(err);
    } else if (data.FileSystems.length) {
      res.json(data.FileSystems);
    } else {
      res.json('No efs data');
    }
  });
};

/* Terminate EFS Instances by id */
module.exports.terminateById = (req, res) => {
  const params = {
    FileSystemId: req.params.id,
  };
  EFS.deleteFileSystem(params, (err) => {
    if (err) res.json(err);
    else {
      LOGGER.info(`${req.params.id} terminated`);
      res.json(`${req.params.id} terminated`);
    }
  });
};

/* GET EFS instances */
module.exports.describeTagsById = (req, res) => {
  EFS.describeTags({
    FileSystemId: req.params.id,
  }, (err, data) => {
    if (err) res.json(err);
    else res.json(data.Tags);
  });
};
