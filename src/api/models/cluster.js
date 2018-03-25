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
  destructionDate: Date,
  region: String,
});

mongoose.model('Cluster', ClusterSchema);
