/* eslint no-param-reassign:0 */
const mongoose = require('mongoose');

const EC2_PRICE = mongoose.model('Ec2Price');
const RDS_PRICE = mongoose.model('RdsPrice');

const getRegion = (region) => {
  if (region.startsWith('us-east-1')) {
    region = 'US';
  } else if (region.startsWith('us-east-2')) {
    region = 'US';
  } else if (region.startsWith('us-west-2')) {
    region = 'US';
  } else if (region.startsWith('ap-southeast-2')) {
    region = 'IN';
  }
  return region;
};

module.exports.getEc2Price = (req, res) => {
  const region = getRegion(req.body.region);

  EC2_PRICE.findOne({
    Region: region,
    Type: req.body.type,
  }, (err, doc) => {
    res.json(doc.Price);
  });
};

module.exports.getRdsPrice = (req, res) => {
  const region = getRegion(req.body.region);

  RDS_PRICE.findOne({
    Region: region,
    Type: req.body.type,
    DB: req.body.DB,
  }, (err, doc) => {
    res.json(doc.Price);
  });
};
