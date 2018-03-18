/* eslint no-unused-vars: 0 */
const LOGGER = require('log4js').getLogger();
const JENKINS = require('jenkins')({
  baseUrl: `http://${process.env.JENKINS_USERNAME}:${process.env.JENKINS_API_TOKEN}@localhost:8080`,
  crumbIssuer: true,
});

LOGGER.level = 'debug';

module.exports.destroy = (req, res) => {
  LOGGER.info(`destroying ${req.params.id}`);
  /*
  JENKINS.job.build('Destroy_Cluster', (err, data) => {
    if (err) throw err;
    res.json(data);
  });
  */
};

module.exports.destroyByName = (name) => {
  LOGGER.info(`destroying ${name}`);
  /*
  JENKINS.job.build('Destroy_Cluster', (err, data) => {
    if (err) throw err;
    res.json(data);
  });
  */
};
