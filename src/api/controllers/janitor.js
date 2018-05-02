/** @module JanitorController */
/* eslint no-param-reassign:0 */
const run = require('docker-run');
const LOGGER = require('log4js').getLogger('janitor');
const CLUSTER_CONTROLLER = require('./cluster');
const Cluster = require('../models/cluster');

let dockerJanitor;
let janitorConfiguration = {};

LOGGER.level = 'info';

/**
 * Adds running janitor to formulated clusters.
 */
const addJanitorToClusters = (region) => {
  Cluster.Model.update({
    region: region,
  }, {
    monkeyPort: 8080,
    monitored: true,
  }, {
    multi: true,
  }, (clustererr) => {
    if (clustererr) LOGGER.err(clustererr);
    else LOGGER.info('updated cluster');
  });
};

/**
 * Route for running the Simian Army Janitor Monkey Docker image.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @param {req.body} janitorConfig - The Janitor configuration settings.
 * @returns {object} - Message that Janitor is created.
 */
module.exports.run = (req, res) => {
  CLUSTER_CONTROLLER.setClusterDB();
  janitorConfiguration = req.body;

  const janitorConfig = {
    ports: {
      8080: 8080,
    },
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
      SIMIANARMY_CLIENT_AWS_REGION: req.body.region,
    },
  };

  addJanitorToClusters(req.body.region);
  dockerJanitor = run('rdcaldwell/janitor:latest', janitorConfig);
  process.stdin.pipe(dockerJanitor.stdin);
  dockerJanitor.stdout.pipe(process.stdout);
  dockerJanitor.stderr.pipe(process.stderr);
  LOGGER.info('Janitor created');
  res.json('Janitor created');
};

/**
 * Route for destroying Janitor by id.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @param {req.params} id - The id of Janitor.
 * @returns {object} - Message that Janitor is destroyed.
 */
module.exports.destroy = (req, res) => {
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
    else LOGGER.info('Updated cluster');
  });

  res.json('Janitor removed');
};

/**
 * Route for getting all Janitors.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @returns {object} - All Janitors.
 */
module.exports.getJanitors = (req, res) => {
  if (dockerJanitor !== undefined) res.json(janitorConfiguration);
  else res.json('Janitor not running');
};

/**
 * Gets state of the Janitor.
 * @returns {boolean} - Janitor running state.
 */
module.exports.isJanitorRunning = () => dockerJanitor !== undefined;

/**
 * Route for getting state of the Janitor.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @returns {boolean} - Janitor running state.
 */
module.exports.isJanitorRunningRoute = (req, res) => {
  res.json(dockerJanitor !== undefined);
};
