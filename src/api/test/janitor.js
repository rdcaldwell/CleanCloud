/* eslint-disable */
require('dotenv').config({ path: '../../../.env' });
const server = require('../../../server-mock');
const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

chai.use(chaiHttp);

describe('Janitor', () => {
  describe('/POST run', () => {
    it('it should a ', (done) => {
      chai.request(server)
        .post('/api/janitor/run')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body[0].should.have.property('SUCCESS');
          done();
        });
    });
  });

  describe('/GET getJanitors', () => {
    it('it should GET ', (done) => {
      chai.request(server)
        .get('/api/janitors')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body[0].should.have.property('Tests');
          done();
        });
    });
  });

  describe('/GET destroyById', () => {
    it('it should GET ', (done) => {
      chai.request(server)
        .get('/api/janitor/destroy/i-03ca172443e06c4e1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body[0].should.have.property('Tests');
          done();
        });
    });
  });
});
