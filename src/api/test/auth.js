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
var SaveMock;

describe('Auth', () => {
  beforeEach(function() {
    SaveMock = sinon.stub(User.Model, 'findOne');
  });

  afterEach(function()  {
    SaveMock.restore();
  });

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

      const test = sinon.stub(User.Model, 'findById').returns(mock);

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
      test.restore();
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
      const res = buildResponse(done);
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

  describe('validate username', () => {
    it('should validate username', (done) => {
      const res = buildResponse();
      const req = HTTP_MOCKS.createRequest({
        method: 'POST',
        url: '/auth/username/admin',
        params: {
          id: 'admin'
        },
      });

      const customer = {
        id: 'admin',
      };

      SaveMock.yields(null, customer);

      res.on('end', () => {
        res._getStatusCode().should.equal(200);
        res._getData().should.containEql('{"found":true}');
        res._getData().should.instanceOf(Object);
        done();
      });

      AUTH_CONTROLLER.validateUsername(req, res);
    });

    it('should not validate username', (done) => {
      const res = buildResponse();
      const req = HTTP_MOCKS.createRequest({
        method: 'POST',
        url: '/auth/username/t',
        params: {
          id: 't'
        },
      });

      SaveMock.yields(null, null);

      res.on('end', () => {
        res._getData().should.equal('{"found":false}');
        done();
      });

      AUTH_CONTROLLER.validateUsername(req, res);
    });
  });

  // Todo
  describe('validate email', () => {
    it('should validate email', (done) => {
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

      SaveMock.yields(null, user);

      res.on('end', () => {
        res._getStatusCode().should.equal(200);
        res._getData().should.instanceOf(Object);
        res._getData().should.containEql('{"found":true}');
        done();
      });

      AUTH_CONTROLLER.validateEmail(req, res);
    });

    it('should not validate email', (done) => {
      const res = buildResponse();
      const req = HTTP_MOCKS.createRequest({
        method: 'POST',
        url: '/auth/email/test@test.com',
        params: {
          id: 'test@test.com'
        },
      });

      SaveMock.yields(null, null);

      res.on('end', () => {
        res._getStatusCode().should.equal(200);
        res._getData().should.instanceOf(Object);
        res._getData().should.containEql('{"found":false}');
        done();
      });

      AUTH_CONTROLLER.validateEmail(req, res);
    });
  });

  // describe('/POST login', () => {
  //   it('should login', (done) => {
  //     const res = buildResponse();
  //     const req = HTTP_MOCKS.createRequest({
  //       method: 'POST',
  //       url: '/auth/login',
  //       body: {
  //         username: 'admin',
  //         email: 'test@fischer.com',
  //         firstName: 'fname',
  //         lastName: 'lname',
  //         password: 'password',
  //       },
  //     });
  //
  //     // Todo, circular structure reference issue?
  //     res.on('end', () => {
  //       res._getStatusCode().should.equal(200);
  //       done();
  //     });
  //
  //     AUTH_CONTROLLER.login(req, res);
  //   });
  // });
});
