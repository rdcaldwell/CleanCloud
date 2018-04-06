const mongoose = require('mongoose');

const Ec2PriceSchema = new mongoose.Schema({
  Region: String,
  Type: String,
  Price: Number,
}, {
  collection: 'ec2_prices',
});

module.exports.Model = mongoose.model('Ec2Price', Ec2PriceSchema);
