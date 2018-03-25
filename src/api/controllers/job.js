/* eslint no-param-reassign:0, no-unused-vars: 0, consistent-return:0 */
const schedule = require('node-schedule');
const LOGGER = require('log4js').getLogger('job');
const mongoose = require('mongoose');
const moment = require('moment');
const JENKINS_CONTROLLER = require('./jenkins');
const EMAIL_CONTROLLER = require('./email');

const CLUSTER = mongoose.model('Cluster');

const jobs = [];

LOGGER.level = 'info';

module.exports.cancelJob = (req, res) => {
  CLUSTER.findOne({
    context: req.params.id,
  }, (err, cluster) => {
    jobs[cluster.jobIndex].cancel();
    cluster.marked = false;
    cluster.jobIndex = null;
    cluster.destructionDate = null;
    cluster.save();
    LOGGER.info(`${cluster.context} job canceled`);
    res.json(`${cluster.context} job canceled`);
  });
};

module.exports.scheduleJob = (name, startedBy) => {
  const today = new Date();
  const destructionTime = new Date(moment().add(2, 'minutes'));

  CLUSTER.findOne({
    context: name,
  }, (err, cluster) => {
    cluster.destructionDate = destructionTime;
    cluster.save();
  });
  jobs.push(schedule.scheduleJob(destructionTime, () => {
    JENKINS_CONTROLLER.destroyByName(name);
    EMAIL_CONTROLLER.emailStartedBy(name, startedBy, 'destroyed');
  }));
  LOGGER.info(`Job scheduled ${destructionTime}`);
};

module.exports.jobs = jobs;
