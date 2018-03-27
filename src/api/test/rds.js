/* eslint-disable */
require('dotenv').config({ path: '../../../.env' });
const server = require('../../../server-mock');
const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

chai.use(chaiHttp);

describe('RDS', () => {
  describe('/Get describe', () => {
    it('it should a ', (done) => {
      chai.request(server)
        .get('/api/describe/rds')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          //res.body[0].Instances[0].InstanceId.should.be.equal('i-03ca172443e06c4e1');
          done();
        });
    });
  });

  describe('/Get describeTagsById', () => {
    it('it should a ', (done) => {
      chai.request(server)
        .get('/api/describe/tags/rds/i-03ca172443e06c4e1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          //res.body[0].Instances[0].InstanceId.should.be.equal('i-03ca172443e06c4e1');
          done();
        });
    });
  });

  describe('/Get create', () => {
    it('it should a ', (done) => {
      chai.request(server)
        .get('/api/create/rds')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          //res.body[0].Instances[0].InstanceId.should.be.equal('i-03ca172443e06c4e1');
          done();
        });
    });
  });

  describe('/Get terminateById', () => {
    it('it should a ', (done) => {
      chai.request(server)
        .get('/api/terminate/rds/i-03ca172443e06c4e1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          //res.body[0].Instances[0].InstanceId.should.be.equal('i-03ca172443e06c4e1');
          done();
        });
    });
  });
});
