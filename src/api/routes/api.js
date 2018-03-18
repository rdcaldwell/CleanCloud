/* eslint no-restricted-syntax:0 */
const ROUTER = require('express').Router();
const AUTH_CONTROLLER = require('../controllers/auth');
const JANITOR_CONTROLLER = require('../controllers/janitor');
const JENKINS_CONTROLLER = require('../controllers/jenkins');
const EC2_CONTROLLER = require('../controllers/ec2');
const EFS_CONTROLLER = require('../controllers/efs');
const RDS_CONTROLLER = require('../controllers/rds');
const PRICE_CONTROLLER = require('../controllers/price');
const MONITOR_CONTROLLER = require('../controllers/monitor');
const ANALYTICS_CONTROLLER = require('../controllers/analytics');
const AUTH = require('express-jwt')({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload',
});

/* User Authorization Controllers */
ROUTER.post('/auth/register', AUTH_CONTROLLER.register);
ROUTER.post('/auth/login', AUTH_CONTROLLER.login);
ROUTER.get('/auth/profile', AUTH, AUTH_CONTROLLER.profileRead);
ROUTER.get('/auth/username/:id', AUTH_CONTROLLER.validateUsername);
ROUTER.get('/auth/email/:id', AUTH_CONTROLLER.validateEmail);

/* Janitor Controller */
ROUTER.post('/janitor/run', JANITOR_CONTROLLER.run);
ROUTER.get('/janitor/destroy/:id', JANITOR_CONTROLLER.destroyById);
ROUTER.get('/janitors', JANITOR_CONTROLLER.getJanitors);

/* Monitoring Controller */
ROUTER.get('/monitor/unmark/:id', MONITOR_CONTROLLER.cancelJob);
ROUTER.get('/monitor/clusters', MONITOR_CONTROLLER.getClusters);

/* EC2 Controller */
ROUTER.get('/ec2/create', EC2_CONTROLLER.create);
ROUTER.get('/ec2/describe', EC2_CONTROLLER.describe);
ROUTER.get('/ec2/terminate/:id', EC2_CONTROLLER.terminateById);
ROUTER.get('/context/:id', EC2_CONTROLLER.getContextById);
ROUTER.get('/context', EC2_CONTROLLER.getContextNames);

/* EFS Controller */
ROUTER.get('/efs/create', EFS_CONTROLLER.create);
ROUTER.get('/efs/describe', EFS_CONTROLLER.describe);
ROUTER.get('/efs/describe/tags/:id', EFS_CONTROLLER.describeTagsById);
ROUTER.get('/efs/terminate/:id', EFS_CONTROLLER.terminateById);

/* RDS Controller */
ROUTER.get('/rds/create', RDS_CONTROLLER.create);
ROUTER.get('/rds/describe', RDS_CONTROLLER.describe);
ROUTER.get('/rds/describe/tags/:id', RDS_CONTROLLER.describeTagsById);
ROUTER.get('/rds/terminate/:id', RDS_CONTROLLER.terminateById);

/* Jenkins Controller */
ROUTER.get('/jenkins/destroy/:id', JENKINS_CONTROLLER.destroy);

/* Analytics Controller */
ROUTER.get('/analyze/:id', ANALYTICS_CONTROLLER.analyzeById);

/* Price Controller */
ROUTER.post('/price/ec2', PRICE_CONTROLLER.getEc2Price);
ROUTER.post('/price/rds', PRICE_CONTROLLER.getRdsPrice);

module.exports = ROUTER;
