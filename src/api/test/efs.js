/* eslint-disable */
require('dotenv').config({
  path: '../../../.env'
});
const EFS_CONTROLLER = require('../controllers/efs');
const http_mocks = require('node-mocks-http');
const should = require('should')
const AWS = require('aws-sdk-mock');

const buildResponse = () => {
  return http_mocks.createResponse({
    eventEmitter: require('events').EventEmitter
  });
};

describe('EFS', () => {
  describe('/GET describe', () => {
    it('should describe no efs data', (done) => {
      AWS.mock('EFS', 'describeFileSystems', {
        "FileSystems": []
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/efs/describe',
      });


      res.on('end', () => {
        res._getData().should.equal('"No efs data"');
        done();
      });

      EFS_CONTROLLER.describe(req, res);
      AWS.restore('EFS');
    });

    it('should describe running efs instances', (done) => {
      AWS.mock('EFS', 'describeFileSystems', {
        "FileSystems": [{}]
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/efs/describe',
      });

      res.on('end', () => {
        res._getData().should.instanceOf(Object);
        done();
      });

      EFS_CONTROLLER.describe(req, res);
      AWS.restore('EFS');
    });

    it('should describe error', (done) => {
      AWS.mock('EFS', 'describeFileSystems', ({}, callback) => {
        callback("Error", null);
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/efs/describe'
      });

      res.on('end', () => {
        res._getData().should.equal('"Error"');
        done();
      });

      EFS_CONTROLLER.describe(req, res);
      AWS.restore('EFS');
    });
  });

  describe('/GET terminate', () => {
    it('should terminate instance by id', (done) => {
      AWS.mock('EFS', 'deleteFileSystem');

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/efs/terminate/fs-7339c10a',
        params: {
          id: 'fs-7339c10a'
        },
      });

      res.on('end', () => {
        res._getData().should.equal('"fs-7339c10a terminated"');
        done();
      });

      EFS_CONTROLLER.terminateById(req, res);
      AWS.restore('EFS');
    });

    it('should get terminate error', (done) => {
      AWS.mock('EFS', 'deleteFileSystem', (params, callback) => {
        callback("Error", null);
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/efs/terminate/fs-7339c10a',
        params: {
          id: 'fs-7339c10a'
        }
      });

      res.on('end', () => {
        res._getData().should.equal('"Error"');
        done();
      });

      EFS_CONTROLLER.terminateById(req, res);
      AWS.restore('EFS');
    });
  });

  describe('/GET describeTagsById', () => {
    it('should describe Filesystem by id', (done) => {
      AWS.mock('EFS', 'describeTags', {
        "Tags": [{
          "Key": "Name",
          "Value": "fs-7339c10a"
        }]
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/efs/describe/tags/fs-7339c10a',
        params: {
          id: 'fs-7339c10a'
        }
      });

      res.on('end', () => {
        res.json(res._getData())
        res._getData().should.containEql('fs-7339c10a');
        done();
      });

      EFS_CONTROLLER.describeTagsById(req, res);
      AWS.restore('EFS');
    });

    it('should get describe by id error', (done) => {
      AWS.mock('EFS', 'describeTags', ({}, callback) => {
        callback("Error", null);
      });

      const res = buildResponse();
      const req = http_mocks.createRequest({
        method: 'GET',
        url: '/api/efs/describe/tags/id',
        params: {
          id: '12'
        }
      });

      res.on('end', () => {
        res._getData().should.equal('"Error"');
        done();
      });

      EFS_CONTROLLER.describeTagsById(req, res);
      AWS.restore('EFS');
    });
  });
});
