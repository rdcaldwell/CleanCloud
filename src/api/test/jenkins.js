/* eslint-disable */
require('dotenv').config({ path: '../../../.env' });
const server = require('../../../server-mock');
const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

chai.use(chaiHttp);

describe('Jenkins', () => {
  describe('/GET destroy', () => {
    it('it should a ', (done) => {
      chai.request(server)
        .get('/api/jenkins/destroy')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body[0].should.have.property('Tests');
          done();
        });
    });
  });
});
