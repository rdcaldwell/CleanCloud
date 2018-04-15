// /* eslint no-unused-vars:0, arrow-body-style:0, no-undef:0, no-underscore-dangle:0 */
// const JOB_CONTROLLER = require('../controllers/job');
// const HTTP_MOCKS = require('node-mocks-http');
// const should = require('should');
// const sinon = require('sinon');
// const events = require('events');
// const Cluster = require('../models/cluster');
// require('../config/tests');
//
// const buildResponse = () => {
//   return HTTP_MOCKS.createResponse({
//     eventEmitter: events.EventEmitter,
//   });
// };
//
// describe('Jobs Controller', () => {
//   // Todo, need findone stub and assert
//   it('should /GET cancel job by id', () => {
//     const res = buildResponse();
//     const req = HTTP_MOCKS.createRequest({
//       method: 'GET',
//       url: '/job/cancel/testid',
//       params: {
//         id: 'testid'
//       },
//     });
//
//     res.on('end', () => {
//       done();
//     });
//
//     JOB_CONTROLLER.cancelJob(req, res);
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
