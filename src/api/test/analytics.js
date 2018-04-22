/* eslint quotes:0, arrow-body-style:0, quote-props:0,
 no-underscore-dangle:0, no-undef:0, no-unused-vars:0
*/
const ANALYTICS_CONTROLLER = require('../controllers/analytics');
const HTTP_MOCKS = require('node-mocks-http');
const should = require('should');
const sinon = require('sinon');
const events = require('events');
const AWS = require('aws-sdk-mock');
require('../config/tests');

const buildResponse = () => {
  return HTTP_MOCKS.createResponse({
    eventEmitter: events.EventEmitter,
  });
};

describe('Analytics', () => {
  describe('/POST analyze', () => {
    it('should get error profile', () => {
      AWS.mock('CloudWatch', 'getMetricStatistics', ({}, callback) => {
        callback("Error", null);
      });
      const res = buildResponse();
      const req = HTTP_MOCKS.createRequest({
        method: 'POST',
        url: '/api/analyze',
        body: { id: '2' },
      });

      req.on('end', () => {
        res._getStatusCode().should.equal(401);
        res._getData().should.instanceOf(Object);
        done();
      });

      ANALYTICS_CONTROLLER.analyzeById(req, res);
      AWS.restore('CloudWatch')
    });
    it('should get profile', (done) => {
      AWS.mock('CloudWatch', 'getMetricStatistics', {});
      const res = buildResponse();
      const req = HTTP_MOCKS.createRequest({
        method: 'POST',
        url: '/api/analyze',
        body: { id: '2' },
      });

      res.on('end', () => {
        res._getStatusCode().should.equal(200);
        res._getData().should.instanceOf(Object);
        done();
      });

      ANALYTICS_CONTROLLER.analyzeById(req, res);
      AWS.restore('CloudWatch')
    });
  });
});
