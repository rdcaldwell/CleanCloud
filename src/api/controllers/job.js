/** @module JobsController */
/* eslint no-param-reassign:0, no-unused-vars: 0, consistent-return:0 */
const schedule = require('node-schedule');
const LOGGER = require('log4js').getLogger('job');
const moment = require('moment');
const ASYNC = require('async');
const JENKINS_CONTROLLER = require('./jenkins');
const EMAIL_CONTROLLER = require('./email');
const Cluster = require('../models/cluster');

const jobs = [];

LOGGER.level = 'info';

/**
 * Route for canceling scheduled job.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @param {req.params} id - The cluster name.
 * @returns {object} - Message that job is canceled.
 */
module.exports.cancelJob = (req, res) => {
  Cluster.Model.findOne({
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

/**
 * Schedules job for cluster destruction and notifying resource owner.
 * @param {string} name - The name of the cluster.
 * @param {string} startedBy - The initials of the resource owner.
 */
module.exports.scheduleJob = (name, startedBy) => {
  const today = new Date();
  const destructionTime = new Date(moment().add(2, 'minutes'));

  Cluster.Model.findOne({
    context: name,
  }, (err, cluster) => {
    cluster.destructionDate = destructionTime;
    cluster.save();
  });

  jobs.push(schedule.scheduleJob(destructionTime, () => {
    JENKINS_CONTROLLER.destroyByName(name);
    EMAIL_CONTROLLER.emailStartedBy(name, startedBy, 'destroyed');
  }));

  LOGGER.info(`Job scheduled for ${destructionTime}`);
};

/**
 * Reschedules jobs in the event the server goes down.
 */
module.exports.setJobs = () => {
  LOGGER.info('Setting up scheduled jobs');

  Cluster.Model.find({
    destructionDate: {
      $gte: new Date(),
    },
  }, (err, clusters) => {
    ASYNC.forEachOf(clusters, (cluster) => {
      jobs.push(schedule.scheduleJob(cluster.destructionDate, () => {
        JENKINS_CONTROLLER.destroyByName(cluster.context);
        EMAIL_CONTROLLER.emailStartedBy(cluster.context, cluster.startedBy, 'destroyed');
      }));

      LOGGER.info(`Job rescheduled for ${cluster.destructionDate}`);
    });
  });
};

module.exports.jobs = jobs;
