const mongoose = require('mongoose');

const ClusterSchema = new mongoose.Schema({
  context: String,
  monitored: Boolean,
  marked: Boolean,
  destroyed: Boolean,
  startedBy: String,
  monkeyPort: Number,
  resourceIds: [],
  jobIndex: Number,
  launchTime: Date,
  destructionDate: Date,
  region: String,
});

module.exports.Model = mongoose.model('Cluster', ClusterSchema);
