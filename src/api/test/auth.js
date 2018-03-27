/* eslint-disable */
require('dotenv').config({ path: '../../../.env' });
const server = require('../../../server-mock');
const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

chai.use(chaiHttp);

describe('Auth', () => {
  describe('/GET profile', () => {
    it('it should GET ', (done) => {
      chai.request(server)
        .get('/api/profile')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body[0].should.have.property('Tests');
          done();
        });
    });
  });

  describe('/POST register', () => {
    it('it should', (done) => {
      chai.request(server)
        .post('/api/register')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body[0].should.have.property('SUCCESS');
          done();
        });
    });
  });

  describe('/POST login', () => {
    it('it should ', (done) => {
      chai.request(server)
        .post('/api/login')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body[0].should.have.property('SUCCESS');
          done();
        });
    });
  });
});
