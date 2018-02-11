var mongoose = require('mongoose');
var db = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ds121543.mlab.com:21543/fischerjanitor`;
const LOG4JS = require('log4js');
const LOGGER = LOG4JS.getLogger();
LOGGER.level = 'debug';

mongoose.connect(db);

mongoose.connection.on('connected', function() {
    LOGGER.info('MongoDB connected');
});

mongoose.connection.on('error', function(err) {
    LOGGER.error('MongoDB connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
    LOGGER.info('MongoDB disconnected');
});

require('./users');
require('./ec2');
require('./efs');
require('./rds');
require('./cluster');