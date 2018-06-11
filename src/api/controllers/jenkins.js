/** @module JenkinsController */
/* eslint no-unused-vars: 0, no-else-return:0, no-param-reassign:0 */
const Cluster = require('../models/cluster');
const jenkins = require('jenkins')({
  baseUrl: `http://${process.env.JENKINS_USERNAME}:${process.env.JENKINS_API_TOKEN}@localhost:8888`,
  crumbIssuer: true,
});
const log = require('log4js').getLogger('jenkins');

log.level = 'info';

/**
 * Triggers Jenkins Destroy_Cluster job using cluster name.
 * @param {string} name - The name of the cluster.
 * @returns {boolean} - Success of cluster destruction.
 */
const destroyByName = (name) => {
  log.info(`destroying ${name}`);
  jenkins.job.build({
    name: 'Destroy/Destroy_Cluster',
    parameters: {
      cluster: name,
    },
  }, (jenkinserr) => {
    if (jenkinserr) {
      log.error(jenkinserr);
      return false;
    } else {
      log.info(`${name} cluster destroyed using Jenkins`);
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
