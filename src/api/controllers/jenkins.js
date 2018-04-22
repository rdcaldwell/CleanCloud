/** @module JenkinsController */
/* eslint no-unused-vars: 0, no-else-return:0, no-param-reassign:0 */
const LOGGER = require('log4js').getLogger('jenkins');
const Cluster = require('../models/cluster');
const JENKINS = require('jenkins')({
  baseUrl: `http://${process.env.JENKINS_USERNAME}:${process.env.JENKINS_API_TOKEN}@localhost:8888`,
  crumbIssuer: true,
});

LOGGER.level = 'info';

/**
 * Triggers Jenkins Destroy_Cluster job using cluster name.
 * @param {string} name - The name of the cluster.
 * @returns {boolean} - Success of cluster destruction.
 */
const destroyByName = (name) => {
  LOGGER.info(`destroying ${name}`);
  JENKINS.job.build({
    name: 'Destroy_Cluster',
    parameters: {
      cluster: name,
    },
  }, (jenkinserr) => {
    if (jenkinserr) {
      LOGGER.error(jenkinserr);
      return false;
    } else {
      LOGGER.info(`${name} cluster destroyed using Jenkins`);
      Cluster.Model.findOne({
        context: name,
      }, (clustererr, cluster) => {
        cluster.destroyed = true;
        cluster.save();
      });
      return true;
    }
  });
};

/**
 * Route for triggering Jenkins Destroy_Cluster job.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @param {req.params} id - The cluster name.
 * @returns {object} - Message that cluster is destroyed using Jenkins.
 */
module.exports.destroy = (req, res) => {
  const isDestroyed = destroyByName(req.params.id);
  if (isDestroyed) res.json(`${req.params.id} cluster destroyed using Jenkins`);
};

module.exports.destroyByName = destroyByName;
