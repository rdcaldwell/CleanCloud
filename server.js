require('dotenv').config();
const EXPRESS = require('express');
const PATH = require('path');
const HTTP = require('http');
const BODY_PARSER = require('body-parser');
const LOGGER = require('log4js').getLogger();

const API_SERVER = EXPRESS();
const PORT = process.env.PORT || '3000';
LOGGER.level = 'debug';

require('./src/api/models/db');
require('./src/api/config/passport');
const API = require('./src/api/routes/mock-api');

API_SERVER.use(BODY_PARSER.json());
API_SERVER.use(BODY_PARSER.urlencoded({ extended: false }));
API_SERVER.use(EXPRESS.static(PATH.join(__dirname, 'dist')));
API_SERVER.use('/api', API);

API_SERVER.get('*', (req, res) => {
  res.sendFile(PATH.join(__dirname, 'dist/index.html'));
});

API_SERVER.set('port', PORT);

HTTP.createServer(API_SERVER).listen(PORT, () => LOGGER.info(`API running on localhost:${PORT}`));
