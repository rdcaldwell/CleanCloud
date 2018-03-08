const mongoose = require('mongoose');

const efsSchema = new mongoose.Schema({
  identifier: String,
  name: String,
  size: Number,
  context: String,
  createdOn: String,
  startedBy: String,
  orgImportPath: String,
  version: String,
  reason: String,
  highAvailability: String,
});

mongoose.model('EFS', efsSchema);
