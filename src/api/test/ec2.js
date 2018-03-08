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
});
