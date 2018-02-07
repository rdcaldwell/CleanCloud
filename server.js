const EXPRESS = require('express');
const PATH = require('path');
const HTTP = require('http');
const BODY_PARSER = require('body-parser');
const API = require('./api');
const SERVER = EXPRESS();
const PORT = process.env.PORT || '3000';
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

SERVER.use(BODY_PARSER.json());
SERVER.use(BODY_PARSER.urlencoded({ extended: false }));
SERVER.use(EXPRESS.static(PATH.join(__dirname, 'dist')));
SERVER.use('/api', API);

SERVER.get('*', (req, res) => {
  res.sendFile(PATH.join(__dirname, 'dist/index.html'));
});

SERVER.set('port', PORT);

HTTP.createServer(SERVER).listen(PORT, () => logger.info("API running on localhost:" + PORT));