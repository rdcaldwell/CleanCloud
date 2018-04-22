// /* eslint no-unused-vars:0, arrow-body-style:0, no-undef:0, no-underscore-dangle:0 */
// const JOB_CONTROLLER = require('../controllers/job');
// const HTTP_MOCKS = require('node-mocks-http');
// const should = require('should');
// const sinon = require('sinon');
// const LOGGER = require('log4js').getLogger('job');
// const events = require('events');
// const JENKINS_CONTROLLER = require('../controllers/jenkins');
// const EMAIL_CONTROLLER = require('../controllers/email');
// const Cluster = require('../models/cluster');
// require('../config/tests');
//
// const buildResponse = () => {
//   return HTTP_MOCKS.createResponse({
//     eventEmitter: events.EventEmitter,
//   });
// };
//
// // Todo need to figure out how to get cluster.save and cancel to work
// describe('Jobs Controller', () => {
//   it('should /GET cancel job by id', (done) => {
//     const res = buildResponse();
//     const req = HTTP_MOCKS.createRequest({
//       method: 'GET',
//       url: '/job/cancel/testid',
//       params: {
//         id: 'testid'
//       },
//     });
//
//     const data = {
//       jobIndex: 3
//     };
//
//     const data2 = {
//       destructionDate: '1000'
//     };
//     var sinonMock = sinon.stub(Cluster.Model, 'findOne').yields(null, data2);
//
//     JOB_CONTROLLER.scheduleJob('name', 'joe');
//     sinonMock.restore();
//     sinon.stub(EMAIL_CONTROLLER, 'emailStartedBy').returns(null);
//     sinon.stub(JENKINS_CONTROLLER, 'destroyByName').returns(null);
//     sinonMock = sinon.stub(Cluster.Model, 'findOne').yields(null, data);
//
//     res.on('end', () => {
//       res._getData().should.equal('"Error"');
//       done();
//     });
//
//     JOB_CONTROLLER.cancelJob(req, res);
//     sinonMock.restore();
//   });
//
//   it('should not set Jobs', () => {
//     const SaveMockSuccess = sinon.mock(Cluster.Model).expects('find').yields(null);
//
//     JOB_CONTROLLER.setJobs();
//     SaveMockSuccess.restore();
//   });
//
//   // Todo not working, needs assert
//   it('should set Jobs', () => {
//     const clusters = [{
//       destructionDate: 'Sun Dec 17 1995 03:24:00 GMT',
//       context: 'test',
//       startedBy: 'joe',
//       }];
//
//     const mock = {
//       exec: (callback) => {
//         callback(null, clusters);
//       },
//     };
//
//     sinon.stub(Cluster.Model, 'find').returns(mock);
//
//     JOB_CONTROLLER.setJobs();
//   });
// });
