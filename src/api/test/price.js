/* eslint no-unused-vars:0, arrow-body-style:0, no-undef:0, no-underscore-dangle:0 */
const HTTP_MOCKS = require('node-mocks-http');
const should = require('should');
const sinon = require('sinon');
const Ec2Price = require('../models/ec2_prices');
const RDS = require('../models/rds_prices');
const EVENTS = require('events');
const PRICE_CONTROLLER = require('../controllers/price')

const buildResponse = () => {
  return HTTP_MOCKS.createResponse({
    eventEmitter: EVENTS.EventEmitter,
  });
};

describe('Price', () => {
  describe('/POST getEc2Price', (done) => {
    it('should describe ec2 price', () => {
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

      const mock = {
        exec: (callback) => {
          callback(null, data);
        },
      };

      const sinonMock = sinon.stub(Ec2Price.Model, 'findOne').returns(mock);

      res.on('end', () => {
        res._getData().should.containEql(3);
        done();
      });

      PRICE_CONTROLLER.getEc2Price(req, res);
      sinonMock.restore();
    });

    it('should not describe ec2 price', () => {
      const res = buildResponse();
      const req = HTTP_MOCKS.createRequest({
        method: 'POST',
        url: '/price/ec2',
        body: {
          region: 'us-west-2',
          Type: 'ec2',
        },
      });

      const SaveMockError = sinon.mock(Ec2Price.Model).expects('findOne').yields('Error');

      res.on('end', () => {
        res._getData().should.equal('"Error"');
        done();
      });

      PRICE_CONTROLLER.getEc2Price(req, res);
      SaveMockError.restore();
    });
  });

  describe('/POST getRdsPrice', () => {
    it('should describe Rds price', () => {
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

      const mock = {
        exec: (callback) => {
          callback(null, doc);
        },
      };

      const sinonMock = sinon.stub(RDS.Model, 'findOne').returns(mock);

      res.on('end', () => {
        res._getStatusCode().should.equal(200);
        res._getData().should.containEql(3)
        done();
      });

      PRICE_CONTROLLER.getRdsPrice(req, res);
      sinonMock.restore();
    });

    it('should not describe Rds price', () => {
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

      const SaveMockError = sinon.mock(RDS.Model).expects('findOne').yields('Error');

      res.on('end', () => {
        res._getData().should.equal('"Error"');
        done();
      });

      PRICE_CONTROLLER.getRdsPrice(req, res);
      SaveMockError.restore();
    });
  });
});
