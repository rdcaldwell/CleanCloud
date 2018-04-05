// /* eslint-disable */
// require('dotenv').config({ path: '../../../.env' });
// const server = require('../../../server-mock');
// const chai = require('chai');
// const chaiHttp = require('chai-http');
//
// const should = chai.should();
//
// chai.use(chaiHttp);
//
// describe('Cost', () => {
//   describe('/GET getCostByName', () => {
//     it('it should GET ', (done) => {
//       chai.request(server)
//         .get('/api/cost/name')
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('array');
//           res.body[0].should.have.property('Tests');
//           done();
//         });
//     });
//   });
//
//   describe('/GET getCostByContext', () => {
//     it('it should GET ', (done) => {
//       chai.request(server)
//         .get('/api/cost/context')
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('array');
//           res.body[0].should.have.property('Tests');
//           done();
//         });
//     });
//   });
//
//   describe('/GET getContextTags', () => {
//     it('it should GET ', (done) => {
//       chai.request(server)
//         .get('/api/cost/tags')
//         .end((err, res) => {
//           res.should.have.status(200);
//           res.body.should.be.a('array');
//           res.body[0].should.have.property('Tests');
//           done();
//         });
//     });
//   });
// });
