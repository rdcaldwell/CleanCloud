// /* eslint no-unused-vars:0, arrow-body-style:0, no-undef:0, no-underscore-dangle:0 */
// const HTTP_MOCKS = require('node-mocks-http');
// const should = require('should');
// const EVENTS = require('events');
// const EMAIL_CONTROLLER = require('../controllers/email')
// const AWS = require('aws-sdk-mock');
//
// const buildResponse = () => {
//   return HTTP_MOCKS.createResponse({
//     eventEmitter: EVENTS.EventEmitter,
//   });
// };
//
// // Todo causes an error, needs an assert
// describe('Email', () => {
//   describe('Email Started By Error', (done) => {
//     it('should test started by error', () => {
//       AWS.mock('SES', 'sendEmail', (params, callback) => {
//         callback('Error', null);
//       });
//
//       EMAIL_CONTROLLER.emailStartedBy('cluster', 'test@test.com', 'My Message');
//       AWS.restore('SES');
//     });
//   });
// });
