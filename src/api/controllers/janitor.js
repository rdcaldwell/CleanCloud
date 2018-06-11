/** @module JanitorController */
/* eslint no-param-reassign:0 */
const async = require('async');
const Cluster = require('../models/cluster');
const config = require('../config/config');
const EmailController = require('./email');
const JobController = require('./job');
const log = require('log4js').getLogger('janitor');
const moment = require('moment');

log.level = 'info';

/**
 * Marks cluster for destruction, schedules destruction, and notifies owner via email.
 * @param {object} cluster - The cluster to be marked.
 */
const markCluster = (cluster) => {
  cluster.marked = true;
  log.info(`${cluster.context} marked`);
  JobController.scheduleJob(cluster.context, cluster.startedBy);
  EmailController.emailStartedBy(cluster.context, cluster.startedBy, 'marked for destruction');
  cluster.jobIndex = JobController.jobs.length - 1;
  cluster.save();
};

/**
 * Finds and marks clusters that are running past the age threshold
 * @param {array} ids - Ids parsed from email.
 */
module.exports.markClusters = () => {
  log.info('Janitor running');
  Cluster.Model.find({
    marked: false,
    monitored: true,
  }, (err, clusters) => {
    async.forEachOf(clusters, (cluster) => {
      const threshold = new Date(moment(cluster.launchTime)
        .add(config.threshold, config.thresholdUnit));
      if (new Date() > threshold) markCluster(cluster);
    });
  });
};

/**
 * Route for removing monitor tag from cluster after it has been opted out.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @returns {object} - Message that monitor has been removed.
 */
module.exports.removeClusterMonitor = (req, res) => {
  Cluster.Model.findOne({
    _id: req.params.id,
  }, (err, cluster) => {
    if (err) res.json(err);
    else {
      cluster.monitored = false;
      cluster.save();
      res.json('Monitor removed');
    }
  });
};

/**
 * Adds monitor tag from cluster after it has been opted in.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @returns {object} - Message that monitor has been added.
 */
module.exports.addClusterMonitor = (req, res) => {
  Cluster.Model.findOne({
    _id: req.params.id,
  }, (err, cluster) => {
    if (err) res.json(err);
    else {
      cluster.monitored = true;
      cluster.save();
      res.json('Monitor added');
    }
  });
};
