/* eslint-disable */
require('dotenv').config({ path: '../../../.env' });
const server = require('../../../server-mock');
const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

chai.use(chaiHttp);

describe('EFS', () => {
  describe('/GET describe', () => {
    it('it should GET ', (done) => {
      chai.request(server)
        .get('/api/describe/efs')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          //res.body[0].Instances[0].InstanceId.should.be.equal('i-03ca172443e06c4e1');
          done();
        });
    });
  });

  describe('/GET describeTagsById', () => {
    it('it should GET ', (done) => {
      chai.request(server)
        .get('/api/describe/tags/efs/i-03ca172443e06c4e1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          //res.body[0].Instances[0].InstanceId.should.be.equal('i-03ca172443e06c4e1');
          done();
        });
    });
  });

  describe('/GET create', () => {
    it('it should GET ', (done) => {
      chai.request(server)
        .get('/api/create/efs')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          //res.body[0].Instances[0].InstanceId.should.be.equal('i-03ca172443e06c4e1');
          done();
        });
    });
  });

  describe('/GET terminateById', () => {
    it('it should GET ', (done) => {
      chai.request(server)
        .get('/api/terminate/efs/i-03ca172443e06c4e1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          //res.body[0].Instances[0].InstanceId.should.be.equal('i-03ca172443e06c4e1');
          done();
        });
    });
  });
});
