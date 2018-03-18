require('dotenv').config();
require('./src/api/models/db');
require('./src/api/config/passport');
const EXPRESS = require('express');
const HTTP = require('http');
const BODY_PARSER = require('body-parser');
const LOGGER = require('log4js').getLogger();
const API = require('./src/api/routes/mock-api');
const MONITOR_CONTROLLER = require('./src/api/controllers/monitor');

const API_SERVER = EXPRESS();
const PORT = process.env.PORT || '3000';

MONITOR_CONTROLLER.startMonitor();

API_SERVER.use(BODY_PARSER.json());
API_SERVER.use('/api', API);
API_SERVER.use(BODY_PARSER.urlencoded({
  extended: false,
}));

API_SERVER.set('port', PORT);

module.exports = HTTP.createServer(API_SERVER).listen(PORT, () => LOGGER.info(`API running on localhost:${PORT}`));
