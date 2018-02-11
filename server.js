require('dotenv').config()
const EXPRESS = require('express');
const PATH = require('path');
const HTTP = require('http');
const BODY_PARSER = require('body-parser');
const API_SERVER = EXPRESS();
const PORT = process.env.PORT || '3000';
const LOG4JS = require('log4js');
const LOGGER = LOG4JS.getLogger();
LOGGER.level = 'debug';

require('./src/api/models/db');
require('./src/api/config/passport');
const API = require('./src/api/routes/api');

API_SERVER.use(BODY_PARSER.json());
API_SERVER.use(BODY_PARSER.urlencoded({ extended: false }));
API_SERVER.use(EXPRESS.static(PATH.join(__dirname, 'dist')));
API_SERVER.use('/api', API);

API_SERVER.get('*', (req, res) => {
  res.sendFile(PATH.join(__dirname, 'dist/index.html'));
});

API_SERVER.set('port', PORT);

HTTP.createServer(API_SERVER).listen(PORT, () => LOGGER.info("API running on localhost:" + PORT));