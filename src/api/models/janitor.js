const mongoose = require('mongoose');

const JanitorSchema = new mongoose.Schema({
  defaultEmail: String,
  summaryEmail: String,
  sourceEmail: String,
  region: String,
  notificationDaysBeforeTermination: String,
  isMonkeyTime: Boolean,
  port: Number,
});

mongoose.model('Janitor', JanitorSchema);
