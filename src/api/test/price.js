/* eslint no-unused-vars:0, arrow-body-style:0, no-undef:0, no-underscore-dangle:0 */
const HTTP_MOCKS = require('node-mocks-http');
const should = require('should');
const sinon = require('sinon');
const Ec2Price = require('../models/ec2_prices');
const RdsPrice = require('../models/rds_prices');
const EVENTS = require('events');
const PRICE_CONTROLLER = require('../controllers/price')

const buildResponse = () => {
  return HTTP_MOCKS.createResponse({
    eventEmitter: EVENTS.EventEmitter,
  });
};

describe('Price', () => {
  describe('/POST getEc2Price', () => {
    it('should describe ec2 price', (done) => {
      const res = buildResponse();
      const req = HTTP_MOCKS.createRequest({
        method: 'POST',
        url: '/price/ec2',
        body: {
          region: 'us-west-1',
          Type: 'ec2',
        },
      });

      const data = {
        Price: 3
      };

      const sinonMock = sinon.stub(Ec2Price.Model, 'findOne').yields(null, data);

      res.on('end', () => {
        res._getStatusCode().should.equal(3);
        done();
      });

      PRICE_CONTROLLER.getEc2Price(req, res);
      sinonMock.restore();
    });

    it('should not describe ec2 price', (done) => {
      const res = buildResponse();
      const req = HTTP_MOCKS.createRequest({
        method: 'POST',
        url: '/price/ec2',
        body: {
          region: 'us-west-2',
          Type: 'ec2',
        },
      });

      const sinonMock = sinon.stub(Ec2Price.Model, 'findOne').yields('Error');


      res.on('end', () => {
        res._getData().should.equal('"Error"');
        done();
      });

      PRICE_CONTROLLER.getEc2Price(req, res);
      sinonMock.restore();
    });
  });

  describe('/POST getRdsPrice', () => {
    it('should describe Rds price', (done) => {
      const res = buildResponse();
      const req = HTTP_MOCKS.createRequest({
        method: 'POST',
        url: '/price/rds',
        body: {
          region: 'ap-southeast-2',
          Type: 'rds',
          DB: 'postgres',
        },
      });

      const doc = {
        Price: 3
      };

      const sinonMock = sinon.stub(RdsPrice.Model, 'findOne').yields(null, doc);

      res.on('end', () => {
        res._getStatusCode().should.equal(3);
        done();
      });

      PRICE_CONTROLLER.getRdsPrice(req, res);
      sinonMock.restore();
    });

    it('should not describe Rds price', (done) => {
      const res = buildResponse();
      const req = HTTP_MOCKS.createRequest({
        method: 'POST',
        url: '/price/rds',
        body: {
          region: 'us-east-1',
          Type: 'rds',
          DB: 'postgres',
        },
      });

      const sinonMock = sinon.stub(RdsPrice.Model, 'findOne').yields('Error');

      res.on('end', () => {
        res._getData().should.equal('"Error"');
        done();
      });

      PRICE_CONTROLLER.getRdsPrice(req, res);
      sinonMock.restore();
    });
  });
});
