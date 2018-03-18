const mongoose = require('mongoose');
const LOG4JS = require('log4js');

const LOGGER = LOG4JS.getLogger();
LOGGER.level = 'debug';

const ClusterSchema = new mongoose.Schema({
  context: String,
  monitored: Boolean,
  marked: Boolean,
  startedBy: String,
  monkeyPort: Number,
  resourceIds: [],
  jobIndex: Number,
  destructionDate: Date,
});

mongoose.model('Cluster', ClusterSchema);
