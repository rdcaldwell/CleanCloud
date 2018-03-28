/* eslint-disable */
require('dotenv').config({
  path: '../../../.env'
});
const EC2_CONTROLLER = require('../controllers/ec2');
const http_mocks = require('node-mocks-http');
const should = require('should')
const AWS = require('aws-sdk-mock');

const buildResponse = () => {
  return http_mocks.createResponse({
    eventEmitter: require('events').EventEmitter
  });
};

describe('EC2', () => {
  describe('/GET describe', () => {
    it('should describe no ec2 data', (done) => {
      AWS.mock('EC2', 'describeInstances', {
        "Reservations": []
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/ec2/describe',
      });


      res.on('end', () => {
        res._getData().should.equal('"No ec2 data"');
        done();
      });

      EC2_CONTROLLER.describe(req, res);
      AWS.restore('EC2');
    });

    it('should describe running ec2 instances', (done) => {
      AWS.mock('EC2', 'describeInstances', {
        "Reservations": [{}]
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/ec2/describe',
      });

      res.on('end', () => {
        res._getData().should.instanceOf(Object);
        done();
      });

      EC2_CONTROLLER.describe(req, res);
      AWS.restore('EC2');
    });

    it('should describe error', (done) => {
      AWS.mock('EC2', 'describeInstances', (callback) => {
        callback("Error", null);
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/ec2/describe'
      });

      res.on('end', () => {
        res._getData().should.equal('"Error"');
        done();
      });

      EC2_CONTROLLER.describe(req, res);
      AWS.restore('EC2');
    });
  });

  describe('/GET create', () => {
    it('should create ec2 instance', (done) => {
      AWS.mock('EC2', 'runInstances', {
        "Instances": [{
          "InstanceId": "i-01cc5e300b08e32d6",
        }]
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/ec2/create',
      });

      res.on('end', () => {
        res._getData().should.equal('"i-01cc5e300b08e32d6 created"');
        done();
      });

      EC2_CONTROLLER.create(req, res);
      AWS.restore('EC2');
    });

    it('should get create error', (done) => {
      AWS.mock('EC2', 'runInstances', (params, callback) => {
        callback("Error", null);
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/ec2/create'
      });

      res.on('end', () => {
        res._getData().should.equal('"Error"');
        done();
      });

      EC2_CONTROLLER.create(req, res);
      AWS.restore('EC2');
    });
  });

  describe('/GET terminate', () => {
    it('should terminate instance by id', (done) => {
      AWS.mock('EC2', 'terminateInstances');

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/ec2/terminate/i-01cc5e300b08e32d6',
        params: {
          id: 'i-01cc5e300b08e32d6'
        },
      });

      res.on('end', () => {
        res._getData().should.equal('"i-01cc5e300b08e32d6 terminated"');
        done();
      });

      EC2_CONTROLLER.terminateById(req, res);
      AWS.restore('EC2');
    });

    it('should get terminate error', (done) => {
      AWS.mock('EC2', 'terminateInstances', (params, callback) => {
        callback("Error", null);
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/ec2/terminate/i-01cc5e300b08e32d6',
        params: {
          id: 'i-01cc5e300b08e32d6'
        }
      });

      res.on('end', () => {
        res._getData().should.equal('"Error"');
        done();
      });

      EC2_CONTROLLER.terminateById(req, res);
      AWS.restore('EC2');
    });
  });

  describe('/GET context', () => {
    it('should get context by id', (done) => {
      AWS.mock('EC2', 'describeInstances', {
        "Reservations": [{}]
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/context/fbi',
        params: {
          id: 'fbi'
        }
      });

      res.on('end', () => {
        res._getData().should.instanceOf(Object);
        done();
      });

      EC2_CONTROLLER.getContextById(req, res);
      AWS.restore('EC2');
    });

    it('should get context error', (done) => {
      AWS.mock('EC2', 'describeInstances', (params, callback) => {
        callback("Error", null);
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/context/fbi',
        params: {
          id: 'fbi'
        }
      });

      res.on('end', () => {
        res._getData().should.equal('"Error"');
        done();
      });

      EC2_CONTROLLER.getContextById(req, res);
      AWS.restore('EC2');
    });
  });

  describe('/GET context names', () => {
    it('should get context names', (done) => {
      AWS.mock('EC2', 'describeTags', {
        "Tags": [{
          "Key": "Context",
          "Value": "Test"
        }]
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/context'
      });

      res.on('end', () => {
        res._getData().should.containEql('Test');
        done();
      });

      EC2_CONTROLLER.getClusterNames(req, res);
      AWS.restore('EC2');
    });

    it('should get context names error', (done) => {
      AWS.mock('EC2', 'describeTags', (params, callback) => {
        callback("Error", null);
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/context'
      });

      res.on('end', () => {
        res._getData().should.equal('"Error"');
        done();
      });

      EC2_CONTROLLER.getClusterNames(req, res);
      AWS.restore('EC2');
    });
  });
});
