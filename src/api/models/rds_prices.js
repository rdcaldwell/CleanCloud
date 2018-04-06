const mongoose = require('mongoose');

const RdsPriceSchema = new mongoose.Schema({
  Region: String,
  DB: String,
  Type: String,
  Price: Number,
}, {
  collection: 'rds_prices',
});

module.exports.Model = mongoose.model('RdsPrice', RdsPriceSchema);
