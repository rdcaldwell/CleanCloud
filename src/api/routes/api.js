/* eslint no-restricted-syntax:0 */
const ROUTER = require('express').Router();
const AUTH = require('express-jwt')({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload',
});

const PROFILE_CONTROLLER = require('../controllers/profile');
const AUTH_CONTROLLER = require('../controllers/auth');
const JANITOR_CONTROLLER = require('../controllers/janitor');
const JENKINS_CONTROLLER = require('../controllers/jenkins');
const EC2_CONTROLLER = require('../controllers/ec2');
const EFS_CONTROLLER = require('../controllers/efs');
const RDS_CONTROLLER = require('../controllers/rds');
const COST_CONTROLLER = require('../controllers/cost');

/* User Authorization Controllers */
ROUTER.get('/profile', AUTH, PROFILE_CONTROLLER.profileRead);
ROUTER.post('/register', AUTH_CONTROLLER.register);
ROUTER.post('/login', AUTH_CONTROLLER.login);

/* Janitor Controller */
ROUTER.post('/janitor/run', JANITOR_CONTROLLER.run);
ROUTER.get('/janitor/destroy/:id', JANITOR_CONTROLLER.destroyById);
ROUTER.get('/janitors', JANITOR_CONTROLLER.getJanitors);

/* EC2 Controller */
ROUTER.get('/create/ec2', EC2_CONTROLLER.create);
ROUTER.get('/describe/ec2', EC2_CONTROLLER.describe);
ROUTER.get('/terminate/ec2/:id', EC2_CONTROLLER.terminateById);
ROUTER.get('/analyze/ec2/:id', EC2_CONTROLLER.analyzeById);
ROUTER.get('/context/ec2/:id', EC2_CONTROLLER.getContextById);
ROUTER.get('/context/names', EC2_CONTROLLER.getContextNames);

/* EFS Controller */
ROUTER.get('/describe/efs', EFS_CONTROLLER.describe);
ROUTER.get('/describe/tags/efs/:id', EFS_CONTROLLER.describeTagsById);
ROUTER.get('/create/efs', EFS_CONTROLLER.create);
ROUTER.get('/terminate/efs/:id', EFS_CONTROLLER.terminateById);

/* RDS Controller */
ROUTER.get('/describe/rds', RDS_CONTROLLER.describe);
ROUTER.get('/describe/tags/rds/:id', RDS_CONTROLLER.describeTagsById);
ROUTER.get('/create/rds', RDS_CONTROLLER.create);
ROUTER.get('/terminate/rds/:id', RDS_CONTROLLER.terminateById);

/* Jenkins Controller */
ROUTER.get('/jenkins/destroy', JENKINS_CONTROLLER.destroy);

/* Cost Controllers */
ROUTER.get('/cost/name', COST_CONTROLLER.getCostByName);
ROUTER.get('/cost/context', COST_CONTROLLER.getCostByContext);
ROUTER.get('/cost/tags', COST_CONTROLLER.getContextTags);

module.exports = ROUTER;
