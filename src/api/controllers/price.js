/** @module PriceController */
/* eslint no-param-reassign:0 */
const Ec2Price = require('../models/ec2_prices');
const RdsPrice = require('../models/rds_prices');

/**
 * Gets region abbreviation of resource.
 * @param {string} region - The region of the instance.
 * @returns - Region abbreviation of resource.
 */
const getRegion = (region) => {
  if (region.startsWith('us')) {
    region = 'US';
  } else {
    region = 'IN';
  }

  return region;
};

/**
 * Route for getting the price of an EC2 instance.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @param {req.body} region - The region of the instance.
 * @param {req.body} type - The type or class of the instance.
 * @returns {number} - Hourly price of the instance.
 */
module.exports.getEc2Price = (req, res) => {
  const region = getRegion(req.body.region);

  Ec2Price.Model.findOne({
    Region: region,
    Type: req.body.type,
  }, (err, doc) => {
    res.json(doc.Price);
  });
};

/**
 * Route for getting the price of an RDS instance.
 * @param {object} req - The request.
 * @param {object} res - The response.
 * @param {req.body} region - The region of the instance.
 * @param {req.body} type - The type or class of the instance.
 * @param {req.body} DB - The database engine of the instance.
 * @returns {number} - Hourly price of the instance.
 */
module.exports.getRdsPrice = (req, res) => {
  const region = getRegion(req.body.region);

  RdsPrice.Model.findOne({
    Region: region,
    Type: req.body.type,
    DB: req.body.DB,
  }, (err, doc) => {
    res.json(doc.Price);
  });
};
