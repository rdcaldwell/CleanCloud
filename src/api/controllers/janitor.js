/* eslint no-param-reassign:0 */
const run = require('docker-run');
const LOGGER = require('log4js').getLogger('janitor');
const CLUSTER_CONTROLLER = require('./cluster');
const Janitor = require('../models/janitor');
const Cluster = require('../models/cluster');

let dockerJanitor;

LOGGER.level = 'info';

function createJanitor(janitorConfig) {
  const janitor = new Janitor.Model();
  janitor.defaultEmail = janitorConfig.defaultEmail;
  janitor.summaryEmail = janitorConfig.summaryEmail;
  janitor.sourceEmail = janitorConfig.sourceEmail;
  janitor.isMonkeyTime = janitorConfig.isMonkeyTime;
  janitor.threshold = janitorConfig.threshold;
  janitor.frequency = janitorConfig.frequency;
  janitor.frequencyUnit = janitorConfig.frequencyUnit;
  janitor.save();
}

module.exports.run = (req, res) => {
  CLUSTER_CONTROLLER.setClusterDB();

  const janitorConfig = {
    ports: {},
    env: {
      SIMIANARMY_CLIENT_AWS_ACCOUNTKEY: `${process.env.AWS_ACCESS_KEY_ID}`,
      SIMIANARMY_CLIENT_AWS_SECRETKEY: `${process.env.AWS_SECRET_ACCESS_KEY}`,
      SIMIANARMY_CALENDAR_ISMONKEYTIME: req.body.isMonkeyTime,
      SIMIANARMY_JANITOR_NOTIFICATION_DEFAULTEMAIL: req.body.defaultEmail,
      SIMIANARMY_JANITOR_SUMMARYEMAIL_TO: req.body.summaryEmail,
      SIMIANARMY_JANITOR_NOTIFICATION_SOURCEEMAIL: req.body.sourceEmail,
      SIMIANARMY_JANITOR_RULE_ORPHANEDINSTANCERULE_INSTANCEAGETHRESHOLD: req.body.threshold,
      SIMIANARMY_SCHEDULER_FREQUENCY: req.body.frequency,
      SIMIANARMY_SCHEDULER_FREQUENCYUNIT: req.body.frequencyUnit,
    },
  };
  janitorConfig.ports[8080] = 8080;

  Cluster.Model.update({}, {
    monkeyPort: 8080,
    monitored: true,
  }, {
    multi: true,
  }, (err) => {
    if (err) LOGGER.err(err);
    else LOGGER.info('updated cluster');
  });

  dockerJanitor = run('rdcaldwell/janitor:latest', janitorConfig);
  process.stdin.pipe(dockerJanitor.stdin);
  dockerJanitor.stdout.pipe(process.stdout);
  dockerJanitor.stderr.pipe(process.stderr);

  createJanitor(req.body);

  LOGGER.info('Janitor created');
  res.json('Janitor created');
};

module.exports.destroyById = (req, res) => {
  Janitor.Model.find({
    _id: req.params.id,
  }, (findErr, janitor) => {
    if (findErr) res.json(findErr);
    else {
      dockerJanitor.destroy();
      dockerJanitor = undefined;

      Cluster.Model.update({}, {
        monkeyPort: null,
        monitored: false,
        marked: false,
      }, {
        multi: true,
      }, (err) => {
        if (err) LOGGER.err(err);
        else LOGGER.info('updated cluster');
      });

      Janitor.Model.remove({
        _id: janitor[0]._id,
      }, (removeErr) => {
        if (removeErr) LOGGER.error(removeErr);
        else LOGGER.info('Janitor removed');
      });

      res.json('Janitor removed');
    }
  });
};

module.exports.getJanitors = (req, res) => {
  Janitor.Model.find({}, (err, janitors) => {
    if (err) res.json(err);
    else res.json(janitors);
  });
};

module.exports.isJanitorRunning = () => dockerJanitor !== undefined;

module.exports.isJanitorRunningRoute = (req, res) => {
  res.json(dockerJanitor !== undefined);
};
