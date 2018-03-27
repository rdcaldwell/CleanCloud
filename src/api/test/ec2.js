/* eslint-disable */
require('dotenv').config({ path: '../../../.env' });
const server = require('../../../server-mock');
const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

chai.use(chaiHttp);

describe('EC2', () => {
  describe('/GET describe ec2', () => {
    it('it should GET all running ec2 instances', (done) => {
      chai.request(server)
        .get('/api/describe/ec2')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body[0].Instances[0].InstanceId.should.be.equal('i-03ca172443e06c4e1');
          done();
        });
    });
  });

  describe('/GET create ', () => {
    it('it should GET ', (done) => {
      chai.request(server)
        .get('/api/create/ec2')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body[0].should.have.property('Tests');
          done();
        });
    });
  });

  describe('/GET terminateById ', () => {
    it('it should terminate by id ', (done) => {
      chai.request(server)
        .get('/api/terminate/ec2/i-03ca172443e06c4e1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body[0].should.have.property('Tests');
          done();
        });
    });
  });

  describe('/GET getContextById ', () => {
    it('it should GET ', (done) => {
      chai.request(server)
        .get('/api/context/ec2/i-03ca172443e06c4e1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body[0].ImageId.should.be.equal('ami-10fd7020');
          done();
        });
    });
  });

  describe('/GET getContextNames ', () => {
    it('it should GET', (done) => {
      chai.request(server)
        .get('/api/context/names')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('names');
          done();
        });
    });
  });

  describe('/GET analyze ', () => {
    it('it should GET ', (done) => {
      chai.request(server)
        .get('/api/analyze/ec2/i-03ca172443e06c4e1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body[0].should.have.property('Tests');
          done();
        });
    });
  });
});
