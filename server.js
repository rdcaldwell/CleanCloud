require('dotenv').config();
require('./src/api/models/db');
require('./src/api/config/passport');
const PACKAGE = require('./package.json');
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

const APP = EXPRESS();
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

APP.use(BODY_PARSER.json());
APP.use('/api', API);
APP.use(BODY_PARSER.urlencoded({
  extended: false,
}));

APP.set('port', PORT);

if (process.env.ENVIRONMENT === 'PROD') {
  APP.use(EXPRESS.static(PATH.join(__dirname, 'dist')));
  APP.use('/dashboard/*', (req, res) => {
    res.sendFile(PATH.join(__dirname, 'dist', 'index.html'));
  });
} else if (process.env.ENVIRONMENT === 'DEV') {
  LOGGER.info('Angular running on localhost:4200');
}

APP.get('*', (req, res) => {
  res.status(404).redirect('/');
});

HTTP.createServer(APP).listen(PORT, () => LOGGER.info(`CleanCloud v${PACKAGE.version} running in ${process.env.ENVIRONMENT} mode on Port ${PORT}`));
