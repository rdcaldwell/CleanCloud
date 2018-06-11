/** @module JobsController */
/* eslint no-param-reassign:0, no-unused-vars: 0, consistent-return:0 */
const async = require('async');
const Cluster = require('../models/cluster');
const config = require('../config/config');
const EmailController = require('./email');
const JenkinsController = require('./jenkins');
const log = require('log4js').getLogger('job');
const moment = require('moment');
const schedule = require('node-schedule');

const jobs = [];

log.level = 'info';

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
    log.info(`${cluster.context} job canceled`);
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
  const destructionTime = new Date(moment().add(config.destroyAfter, config.destroyAfterUnit));

  Cluster.Model.findOne({
    context: name,
  }, (err, cluster) => {
    cluster.destructionDate = destructionTime;
    cluster.save();
  });

  jobs.push(schedule.scheduleJob(destructionTime, () => {
    if (!config.leashed) {
      JenkinsController.destroyByName(name);
      EmailController.emailStartedBy(name, startedBy, 'destroyed');
    }
  }));

  log.info(`Job scheduled for ${destructionTime}`);
};

/**
 * Reschedules jobs in the event the server goes down.
 */
module.exports.setJobs = () => {
  log.info('Setting up scheduled jobs');

  Cluster.Model.find({
    destructionDate: {
      $gte: new Date(),
    },
  }, (err, clusters) => {
    async.forEachOf(clusters, (cluster) => {
      jobs.push(schedule.scheduleJob(cluster.destructionDate, () => {
        JenkinsController.destroyByName(cluster.context);
        EmailController.emailStartedBy(cluster.context, cluster.startedBy, 'destroyed');
      }));

      log.info(`Job rescheduled for ${cluster.destructionDate}`);
    });
  });
};

module.exports.jobs = jobs;
