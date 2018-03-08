const LOGGER = require('log4js').getLogger();
const JENKINS = require('jenkins')({
  baseUrl: `http://${process.env.JENKINS_USERNAME}:${process.env.JENKINS_API_TOKEN}@localhost:8080`,
  crumbIssuer: true,
});

LOGGER.level = 'debug';

module.exports.destroy = (req, res) => {
  JENKINS.job.build('Destroy_Cluster', (err, data) => {
    if (err) throw err;
    LOGGER.info('queue item number', data);
    res.json(data);
  });
};
