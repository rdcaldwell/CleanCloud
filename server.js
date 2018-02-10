const EXPRESS = require('express');
const PATH = require('path');
const HTTP = require('http');
const BODY_PARSER = require('body-parser');
const SERVER = EXPRESS();
const PORT = process.env.PORT || '3000';
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

require('./src/api/models/db');
require('./src/api/config/passport');
const API = require('./src/api/routes/api');

SERVER.use(BODY_PARSER.json());
SERVER.use(BODY_PARSER.urlencoded({ extended: false }));
SERVER.use(EXPRESS.static(PATH.join(__dirname, 'dist')));
SERVER.use('/api', API);

SERVER.get('*', (req, res) => {
  res.sendFile(PATH.join(__dirname, 'dist/index.html'));
});

SERVER.set('port', PORT);

HTTP.createServer(SERVER).listen(PORT, () => logger.info("API running on localhost:" + PORT));