const mongoose = require('mongoose');
const LOGGER = require('log4js').getLogger('db');

const db = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@ds121543.mlab.com:21543/fischerjanitor`;

LOGGER.level = 'info';

mongoose.connect(db);

mongoose.connection.on('connected', () => {
  LOGGER.info('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  LOGGER.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  LOGGER.info('MongoDB disconnected');
});

require('./users');
require('./cluster');
require('./janitor');
require('./ec2_prices');
require('./rds_prices');
