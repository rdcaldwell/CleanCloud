/* eslint no-param-reassign:0 */
const run = require('docker-run');
const MONGOOSE = require('mongoose');
const LOGGER = require('log4js').getLogger('janitor');

const JANITOR = MONGOOSE.model('Janitor');
const CLUSTER = MONGOOSE.model('Cluster');

let WEST_2 = {};
let EAST_1 = {};
let EAST_2 = {};
let AP_SOUTH_1 = {};

LOGGER.level = 'info';

function createJanitor(janitorConfig) {
  const janitor = new JANITOR();
  janitor.region = janitorConfig.region;
  janitor.defaultEmail = janitorConfig.defaultEmail;
  janitor.summaryEmail = janitorConfig.summaryEmail;
  janitor.sourceEmail = janitorConfig.sourceEmail;
  janitor.isMonkeyTime = janitorConfig.isMonkeyTime;
  janitor.port = janitorConfig.port;
  janitor.save();
}

module.exports.run = (req, res) => {
  const janitorConfig = {
    ports: {},
    env: {
      SIMIANARMY_CLIENT_AWS_ACCOUNTKEY: `${process.env.AWS_ACCESS_KEY_ID}`,
      SIMIANARMY_CLIENT_AWS_SECRETKEY: `${process.env.AWS_SECRET_ACCESS_KEY}`,
      SIMIANARMY_CLIENT_AWS_REGION: req.body.region,
      SIMIANARMY_CALENDAR_ISMONKEYTIME: req.body.isMonkeyTime,
      SIMIANARMY_JANITOR_NOTIFICATION_DEFAULTEMAIL: req.body.defaultEmail,
      SIMIANARMY_JANITOR_SUMMARYEMAIL_TO: req.body.summaryEmail,
      SIMIANARMY_JANITOR_NOTIFICATION_SOURCEEMAIL: req.body.sourceEmail,
      SIMIANARMY_JANITOR_RULE_UNTAGGEDRULE_RESOURCES: 'Instance, ASG, EBS_Volume, EBS_Snapshot',
    },
  };
  janitorConfig.ports[req.body.port] = req.body.port;

  CLUSTER.find({
    region: janitorConfig.env.SIMIANARMY_CLIENT_AWS_REGION,
  }, (err, clusters) => {
    clusters.forEach((cluster) => {
      cluster.monkeyPort = req.body.port;
      cluster.monitored = true;
      cluster.marked = false;
      cluster.save();
    });
  });

  switch (janitorConfig.env.SIMIANARMY_CLIENT_AWS_REGION) {
    case 'us-east-1':
      EAST_1 = run('rdcaldwell/janitor', janitorConfig);
      process.stdin.pipe(EAST_1.stdin);
      EAST_1.stdout.pipe(process.stdout);
      EAST_1.stderr.pipe(process.stderr);
      break;
    case 'us-east-2':
      EAST_2 = run('rdcaldwell/janitor', janitorConfig);
      process.stdin.pipe(EAST_2.stdin);
      EAST_2.stdout.pipe(process.stdout);
      EAST_2.stderr.pipe(process.stderr);
      break;
    case 'us-west-2':
      WEST_2 = run('rdcaldwell/janitor', janitorConfig);
      process.stdin.pipe(WEST_2.stdin);
      WEST_2.stdout.pipe(process.stdout);
      WEST_2.stderr.pipe(process.stderr);
      break;
    case 'ap-south-1':
      AP_SOUTH_1 = run('rdcaldwell/janitor', janitorConfig);
      process.stdin.pipe(AP_SOUTH_1.stdin);
      AP_SOUTH_1.stdout.pipe(process.stdout);
      AP_SOUTH_1.stderr.pipe(process.stderr);
      break;
    default:
      LOGGER.error('Invalid region');
  }

  createJanitor(req.body);

  LOGGER.info(`${janitorConfig.env.SIMIANARMY_CLIENT_AWS_REGION} janitor created`);
  res.json(`${janitorConfig.env.SIMIANARMY_CLIENT_AWS_REGION} janitor created`);
};

module.exports.destroyById = (req, res) => {
  JANITOR.find({
    _id: req.params.id,
  }, (findErr, janitor) => {
    if (findErr) res.json(findErr);
    else {
      switch (janitor[0].region) {
        case 'us-east-1':
          EAST_1.destroy();
          break;
        case 'us-east-2':
          EAST_2.destroy();
          break;
        case 'us-west-2':
          WEST_2.destroy();
          break;
        case 'ap-south-1':
          AP_SOUTH_1.destroy();
          break;
        default:
          LOGGER.info('No janitors to destroy');
      }

      CLUSTER.find({
        region: req.params.id,
      }, (err, clusters) => {
        clusters.forEach((cluster) => {
          cluster.monkeyPort = null;
          cluster.monitored = null;
          cluster.marked = null;
          cluster.save();
        });
      });

      JANITOR.remove({
        _id: janitor[0]._id,
      }, (removeErr) => {
        if (removeErr) LOGGER.error(removeErr);
        else LOGGER.info(`${janitor[0].region} janitor removed`);
      });

      res.json(`${janitor[0].region} janitor destroyed`);
    }
  });
};

module.exports.getJanitors = (req, res) => {
  JANITOR.find({}, (err, janitors) => {
    if (err) res.json(err);
    else res.json(janitors);
  });
};
