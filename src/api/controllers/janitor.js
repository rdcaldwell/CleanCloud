const run = require('docker-run');
const MONGOOSE = require('mongoose');
const LOGGER = require('log4js').getLogger();

const JANITOR = MONGOOSE.model('Janitor');

let WEST_2 = {};
let EAST_1 = {};
let EAST_2 = {};
let AP_SOUTH_1 = {};

LOGGER.level = 'debug';

function createJanitor(janitorConfig) {
  const janitor = new JANITOR();
  janitor.region = janitorConfig.region;
  janitor.defaultEmail = janitorConfig.defaultEmail;
  janitor.summaryEmail = janitorConfig.summaryEmail;
  janitor.sourceEmail = janitorConfig.sourceEmail;
  janitor.isMonkeyTime = janitorConfig.isMonkeyTime;
  janitor.port = janitorConfig.port;
  janitor.save((err) => {
    if (err) LOGGER.info(err);
    else LOGGER.info(janitor._id);
  });
}

module.exports.run = (req, res) => {
  const janitorConfig = {
    ports: {},
    env: {
      SIMIANARMY_CLIENT_AWS_ACCOUNTKEY: `${process.env.AWS_ACCESS_KEY_ID}`,
      SIMIANARMY_CLIENT_AWS_SECRETKEY: `${process.env.AWS_SECRET_ACCESS_KEY}`,
      SIMIANARMY_CLIENT_AWS_REGION: req.body.region,
      SIMIANARMY_CALENDAR_ISMONKEYTIME: req.body.isMonkeyTime,
      SIMIANARMY_CHAOS_ENABLED: false,
      SIMIANARMY_CHAOS_LEASHED: false,
      SIMIANARMY_JANITOR_ENABLED: true,
      SIMIANARMY_JANITOR_LEASHED: false,
      SIMIANARMY_JANITOR_NOTIFICATION_DEFAULTEMAIL: req.body.defaultEmail,
      SIMIANARMY_JANITOR_SUMMARYEMAIL_TO: req.body.summaryEmail,
      SIMIANARMY_JANITOR_NOTIFICATION_SOURCEEMAIL: req.body.sourceEmail,
      SIMIANARMY_JANITOR_RULE_ORPHANEDINSTANCERULE_INSTANCEAGETHRESHOLD: 1,
    },
  };
  janitorConfig.ports[req.body.port] = req.body.port;
  switch (janitorConfig.env.SIMIANARMY_CLIENT_AWS_REGION) {
    case 'us-east-1':
      EAST_1 = run('mlafeldt/simianarmy', janitorConfig);
      break;
    case 'us-east-2':
      EAST_2 = run('mlafeldt/simianarmy', janitorConfig);
      break;
    case 'us-west-2':
      WEST_2 = run('mlafeldt/simianarmy', janitorConfig);
      break;
    case 'ap-south-1':
      AP_SOUTH_1 = run('mlafeldt/simianarmy', janitorConfig);
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
