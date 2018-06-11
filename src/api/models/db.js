const log = require('log4js').getLogger('db');
const mongoose = require('mongoose');

const db = 'mongodb://localhost:27017/cleancloud';

log.level = 'info';

mongoose.connect(db);

mongoose.connection.on('connected', () => {
  log.info('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  log.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  log.info('MongoDB disconnected');
});

require('./cluster');
require('./ec2_prices');
require('./rds_prices');
