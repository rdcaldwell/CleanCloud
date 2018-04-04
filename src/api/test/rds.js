/* eslint-disable */
require('dotenv').config({
  path: '../../../.env'
});
const RDS_CONTROLLER = require('../controllers/rds');
const http_mocks = require('node-mocks-http');
const should = require('should')
const AWS = require('aws-sdk-mock');

const buildResponse = () => {
  return http_mocks.createResponse({
    eventEmitter: require('events').EventEmitter
  });
};

describe('RDS', () => {
  describe('/GET describe', () => {
    it('should describe no rds data', (done) => {
      AWS.mock('RDS', 'describeDBInstances', {
        "DBInstances": []
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/rds/describe',
      });


      res.on('end', () => {
        res._getData().should.equal('"No rds data"');
        done();
      });

      RDS_CONTROLLER.describe(req, res);
      AWS.restore('RDS');
    });

    it('should describe running rds instances', (done) => {
      AWS.mock('RDS', 'describeDBInstances', {
        "DBInstances": [{}]
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/rds/describe',
      });

      res.on('end', () => {
        res._getData().should.instanceOf(Object);
        done();
      });

      RDS_CONTROLLER.describe(req, res);
      AWS.restore('RDS');
    });

    it('should describe error', (done) => {
      AWS.mock('RDS', 'describeDBInstances', (callback) => {
        callback("Error", null);
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/rds/describe'
      });

      res.on('end', () => {
        res._getData().should.equal('"Error"');
        done();
      });

      RDS_CONTROLLER.describe(req, res);
      AWS.restore('RDS');
    });
  });

  describe('/GET create', () => {
    it('should create rds instance', (done) => {
      AWS.mock('RDS', 'createDBInstance', {
        "DBInstance": {
          "DBInstanceIdentifier": "db-test"
        }
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/rds/create',
      });

      res.on('end', () => {
        res._getData().should.equal('"db-test created"');
        done();
      });

      RDS_CONTROLLER.create(req, res);
      AWS.restore('RDS');
    });

    it('should get create error', (done) => {
      AWS.mock('RDS', 'createDBInstance', (params, callback) => {
        callback("Error", null);
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/rds/create'
      });

      res.on('end', () => {
        res._getData().should.equal('"Error"');
        done();
      });

      RDS_CONTROLLER.create(req, res);
      AWS.restore('RDS');
    });
  });

  describe('/GET terminateById', () => {
    it('should terminate instance by id', (done) => {
      AWS.mock('RDS', 'deleteDBInstance', {
        "DBInstance": {
          "DBInstanceIdentifier": "db-test"
        }
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/rds/terminate/db-test',
        params: {
          id: "db-test"
        }
      });

      res.on('end', () => {
        res._getData().should.equal('"db-test terminated"');
        done();
      });

      RDS_CONTROLLER.terminateById(req, res);
      AWS.restore('RDS');
    });

    it('should get terminate error', (done) => {
      AWS.mock('RDS', 'deleteDBInstance', (params, callback) => {
        callback("Error", null);
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/rds/terminate/db-test',
        params: {
          id: 'db-test'
        }
      });

      res.on('end', () => {
        res._getData().should.equal('"Error"');
        done();
      });

      RDS_CONTROLLER.terminateById(req, res);
      AWS.restore('RDS');
    });
  });

  describe('/GET describeTagsById', () => {
    it('should describe DBInstance by id', (done) => {
      AWS.mock('RDS', 'listTagsForResource', {
        "TagList": [{
          "Key": "Name",
          "Value": "db-test"
        }]
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/rds/describe/tags/db-test',
        params: {
          id: "db-test"
        },
      });

      res.on('end', () => {
        res.json(res._getData())
        res._getData().should.containEql('db-test');
        done();
      });

      RDS_CONTROLLER.describeTagsById(req, res);
      AWS.restore('RDS');
    });

    // Todo, callback issue same as efs
    xit('should get describe by id error', (done) => {
      AWS.mock('RDS', 'listTagsForResource', (callback) => {
        callback("Error", null);
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/rds/describe/tags/db-test',
        params: {
          id: "db-test"
        },
      });

      res.on('end', () => {
        res.json(res._getData())
        res._getData().should.equal('"Error"');
        done();
      });

      RDS_CONTROLLER.describeTagsById(req, res);
      AWS.restore('RDS');
    });
  });
});
