require('dotenv').config();
require('./src/api/models/db');
require('./src/api/config/passport');
const EXPRESS = require('express');
const HTTP = require('http');
const PATH = require('path');
const BODY_PARSER = require('body-parser');
const LOGGER = require('log4js').getLogger('server');
const API = require('./src/api/routes/api');
const CLUSTER_CONTROLLER = require('./src/api/controllers/cluster');
const EMAIL_CONTROLLER = require('./src/api/controllers/email');
const JOB_CONTROLLER = require('./src/api/controllers/job');

LOGGER.level = 'info';

const API_SERVER = EXPRESS();
const PORT = process.env.PORT || '3000';
// Clean up cluster DB on start up
CLUSTER_CONTROLLER.cleanClusterDB();
// Set up cluster DB on start up
CLUSTER_CONTROLLER.setClusterDB();
// Set up scheduled jobs
JOB_CONTROLLER.setJobs();
// Start janitor monitor
EMAIL_CONTROLLER.startMonitor();
// Update cluster DB every 90 seconds
setInterval(() => {
  CLUSTER_CONTROLLER.setClusterDB();
}, 90000);
// Clean up cluster DB every 10 minutes
setInterval(() => {
  CLUSTER_CONTROLLER.cleanClusterDB();
}, 600000);

if (process.env.ENVIRONMENT === 'PROD') {
  API_SERVER.use(EXPRESS.static(PATH.join(__dirname, 'dist')));
}
API_SERVER.use(BODY_PARSER.json());
API_SERVER.use('/api', API);
API_SERVER.use(BODY_PARSER.urlencoded({
  extended: false,
}));

API_SERVER.set('port', PORT);

HTTP.createServer(API_SERVER).listen(PORT, () => LOGGER.info(`API running on localhost:${PORT}`));
if (process.env.ENVIRONMENT === 'DEV') {
  LOGGER.info('Angular running on localhost:4200');
}
