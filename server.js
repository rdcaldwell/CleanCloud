require('dotenv').config();
require('./src/api/models/db');
const api = require('./src/api/routes/api');
const bodyParser = require('body-parser');
const ClusterController = require('./src/api/controllers/cluster');
const config = require('./src/api/config/config');
const express = require('express');
const http = require('http');
const JanitorController = require('./src/api/controllers/janitor');
const JobController = require('./src/api/controllers/job');
const log = require('log4js').getLogger('server');
const path = require('path');

log.level = 'info';

const app = express();
const port = process.env.PORT || '3000';

// Clean up cluster DB on start up
ClusterController.cleanClusterDB();
// Set up cluster DB on start up
ClusterController.setClusterDB();
// Set up scheduled jobs
JobController.setJobs();
// Marks clusters
setInterval(() => {
  JanitorController.markClusters();
}, config.interval);
// Update cluster DB every 90 seconds
setInterval(() => {
  ClusterController.setClusterDB();
}, 90000);
// Clean up cluster DB every 10 minutes
setInterval(() => {
  ClusterController.cleanClusterDB();
}, 600000);

app.use(bodyParser.json());
app.use('/api', api);
app.use(bodyParser.urlencoded({
  extended: false,
}));

app.set('port', port);

if (config.environment === 'PROD') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.use('/dashboard/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else if (config.environment === 'DEV') {
  log.info('Angular running on localhost:4200');
}

app.get('*', (req, res) => {
  res.status(404).redirect('/');
});

http.createServer(app).listen(port, () => log.info(`CleanCloud running in ${config.environment} mode on Port ${port}`));
