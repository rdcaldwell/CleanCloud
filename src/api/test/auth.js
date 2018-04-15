/* eslint no-unused-vars:0, arrow-body-style:0, no-undef:0, no-underscore-dangle:0 */
const AUTH_CONTROLLER = require('../controllers/auth');
const HTTP_MOCKS = require('node-mocks-http');
const should = require('should');
const sinon = require('sinon');
const events = require('events');
const User = require('../models/users');
require('../config/tests');

const buildResponse = () => {
  return HTTP_MOCKS.createResponse({
    eventEmitter: events.EventEmitter,
  });
};

describe('Auth', () => {
  describe('/GET profile', () => {
    it('should get profile', (done) => {
      const user = {
        _id: '5a7e52077be76e6f0260bd3b',
        username: 'admin',
      };

      const mock = {
        exec: (callback) => {
          callback(null, user);
        },
      };

      sinon.stub(User.Model, 'findById').returns(mock);

      const res = buildResponse();
      const req = HTTP_MOCKS.createRequest({
        method: 'GET',
        url: '/auth/profile',
        payload: user,
      });

      res.on('end', () => {
        res._getData().should.containEql('admin');
        done();
      });

      AUTH_CONTROLLER.profileRead(req, res);
    });

    it('should get profile error', (done) => {
      const res = buildResponse();
      const req = HTTP_MOCKS.createRequest({
        method: 'GET',
        url: '/auth/profile',
        payload: {},
      });

      res.on('end', () => {
        res._getStatusCode().should.equal(401);
        res._getData().should.instanceOf(Object);
        done();
      });

      AUTH_CONTROLLER.profileRead(req, res);
    });
  });

  describe('/POST register', () => {
    it('should register', (done) => {
      const res = buildResponse();
      const req = HTTP_MOCKS.createRequest({
        method: 'POST',
        url: '/auth/register',
        body: {
          username: 'username',
          email: 'test@fischer.com',
          firstName: 'fname',
          lastName: 'lname',
          password: 'password',
        },
      });

      const SaveMockSuccess = sinon.mock(User.Model.prototype).expects('save').yields(null);

      res.on('end', () => {
        res._getStatusCode().should.equal(200);
        res._getData().should.instanceOf(Object);
        done();
      });

      AUTH_CONTROLLER.register(req, res);

      SaveMockSuccess.restore();
    });

    it('should get register error', (done) => {
      const res = buildResponse();
      const req = HTTP_MOCKS.createRequest({
        method: 'POST',
        url: '/auth/register',
        body: {
          username: 'username',
          email: 'test@fischer.com',
          firstName: 'fname',
          lastName: 'lname',
          password: 'password',
        },
      });

      const SaveMockError = sinon.mock(User.Model.prototype).expects('save').yields('Error');

      res.on('end', () => {
        res._getData().should.equal('"Error"');
        done();
      });

      AUTH_CONTROLLER.register(req, res);

      SaveMockError.restore();
    });
  });

  // Todo
  describe('validate username', () => {
    it('should validate username', () => {
      const res = buildResponse();
      const req = HTTP_MOCKS.createRequest({
        method: 'POST',
        url: '/auth/username/test',
        params: {
          id: 'test'
        },
      });

      const user = {
        id: 'test',
      };

      const mock = {
        exec: (callback) => {
          callback(null, user);
        },
      };
      const SaveMockError = sinon.stub(User.Model, 'findOne').yields(mock);

      res.on('end', () => {
        res._getStatusCode().should.equal(200);
        res._getData().should.containEql('test');
        res._getData().should.instanceOf(Object);
        done();
      });

      AUTH_CONTROLLER.validateUsername(req, res);

      SaveMockError.restore();
    });

    it('should not validate username', () => {
      const res = buildResponse();
      const req = HTTP_MOCKS.createRequest({
        method: 'POST',
        url: '/auth/username/t',
        params: {
          id: 't'
        },
      });

      const SaveMockError = sinon.mock(User.Model.prototype).expects('save').yields('Error');

      res.on('end', () => {
        res._getData().should.equal('"Error"');
        done();
      });

      AUTH_CONTROLLER.validateUsername(req, res);

      SaveMockError.restore();
    });
  });

  // Todo
  describe('validate email', () => {
    it('should validate email', () => {
      const res = buildResponse();
      const req = HTTP_MOCKS.createRequest({
        method: 'POST',
        url: '/auth/email/test@test.com',
        params: {
          id: 'test@test.com'
        },
      });

      const user = {
        id: 'test@test.com',
      };

      const mock = {
        exec: (callback) => {
          callback(null, user);
        },
      };
      const SaveMockError = sinon.stub(User.Model, 'findOne').yields(mock);

      res.on('end', () => {
        res._getStatusCode().should.equal(200);
        res._getData().should.instanceOf(Object);
        res._getData().should.containEql('test@test.com');
        done();
      });
      AUTH_CONTROLLER.validateEmail(req, res);

      SaveMockError.restore();
    });
  });

  describe('/POST login', () => {
    it('should login', () => {
      const res = buildResponse();
      const req = HTTP_MOCKS.createRequest({
        method: 'POST',
        url: '/auth/login',
        body: {
          username: 'admin',
          email: 'test@fischer.com',
          firstName: 'fname',
          lastName: 'lname',
          password: 'password',
        },
      });

      // Todo, circular structure reference issue?
      res.on('end', () => {
        res._getStatusCode().should.equal(200);
        done();
      });

      AUTH_CONTROLLER.login(req, res);
    });
  });
});
