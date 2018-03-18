const mongoose = require('mongoose');

const EC2_PRICE = mongoose.model('Ec2Price');
const RDS_PRICE = mongoose.model('RdsPrice');

module.exports.getEc2Price = (req, res) => {
  let region = '';
  if (req.body.region.startsWith('us-east-1')) {
    region = 'US';
  } else if (req.body.region.startsWith('us-east-2')) {
    region = 'US';
  } else if (req.body.region.startsWith('us-west-2')) {
    region = 'US';
  } else if (req.body.region.startsWith('ap-southeast-2')) {
    region = 'IN';
  }

  EC2_PRICE.findOne({
    Region: region,
    Type: req.body.type,
  }, (err, doc) => {
    res.json(doc.Price);
  });
};

module.exports.getRdsPrice = (req, res) => {
  let region = '';
  if (req.body.region.startsWith('us-east-1')) {
    region = 'US';
  } else if (req.body.region.startsWith('us-east-2')) {
    region = 'US';
  } else if (req.body.region.startsWith('us-west-2')) {
    region = 'US';
  } else if (req.body.region.startsWith('ap-southeast-2')) {
    region = 'IN';
  }

  RDS_PRICE.findOne({
    Region: region,
    Type: req.body.type,
    DB: req.body.DB,
  }, (err, doc) => {
    res.json(doc.Price);
  });
};
