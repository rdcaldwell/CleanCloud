// /* eslint-disable */
// require('dotenv').config({
//   path: '../../../.env'
// });
// const ANALYTICS_CONTROLLER = require('../controllers/analytics');
// const http_mocks = require('node-mocks-http');
// const should = require('should')
// const AWS = require('aws-sdk-mock');
//
// const buildResponse = () => {
//   return http_mocks.createResponse({
//     eventEmitter: require('events').EventEmitter
//   });
// };
//
// describe('Analytics', () => {
//   describe('/GET analyzeByID', () => {
//     it('should get analysis by Id', (done) => {
//       AWS.mock('CLOUD_WATCH', 'getMetricStatistics');
//
//       const res = buildResponse();
//       const req = http_mocks.createRequest({
//         method: 'GET',
//         url: '/api/analyze',
//       });
//
//
//       res.on('end', () => {
//         res._getData().should.equal('"No efs data"');
//         done();
//       });
//
//       ANALYTICS_CONTROLLER.analyzeById(req, res);
//       AWS.restore('CLOUD_WATCH');
//     });
//
//     it('should get analysis by Id error', (done) => {
//       AWS.mock('CLOUD_WATCH', 'getMetricStatistics', (callback) => {
//         callback("Error", null);
//       });
//
//       const res = buildResponse();
//       const req = http_mocks.createRequest({
//         method: 'GET',
//         url: '/api/analyze',
//       });
//
//
//       res.on('end', () => {
//         res._getData().should.equal('"Error"');
//         done();
//       });
//
//       ANALYTICS_CONTROLLER.analyzeById(req, res);
//       AWS.restore('CLOUD_WATCH');
//     });
//   });
// });
