/* eslint no-restricted-syntax:0 */
const AnalyticsController = require('../controllers/analytics');
const auth = require('express-jwt')({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload',
});
const AuthController = require('../controllers/auth');
const ClusterController = require('../controllers/cluster');
const Ec2Controller = require('../controllers/ec2');
const EfsController = require('../controllers/efs');
const JanitorController = require('../controllers/janitor');
const JenkinsController = require('../controllers/jenkins');
const JobController = require('../controllers/job');
const PriceController = require('../controllers/price');
const RdsController = require('../controllers/rds');
const router = require('express').Router();

/* Authentication Controller */
router.post('/auth/login', AuthController.login);
router.get('/auth/profile', auth, AuthController.profileRead);

/* Janitor Controller */
router.get('/janitor/monitor/remove/:id', JanitorController.removeClusterMonitor);
router.get('/janitor/monitor/add/:id', JanitorController.addClusterMonitor);

/* Job Controller */
router.get('/job/cancel/:id', JobController.cancelJob);

/* Cluster Controller */
router.get('/clusters', ClusterController.getClusters);
router.get('/cluster', Ec2Controller.getContextById);
router.get('/cluster/names', Ec2Controller.getClusterNames);

/* EC2 Controller */
router.get('/ec2/describe', Ec2Controller.describe);
router.get('/ec2/terminate', Ec2Controller.terminateById);

/* EFS Controller */
router.get('/efs/describe', EfsController.describe);
router.get('/efs/terminate', EfsController.terminateById);

/* RDS Controller */
router.get('/rds/describe', RdsController.describe);
router.get('/rds/terminate', RdsController.terminateById);

/* Jenkins Controller */
router.get('/jenkins/destroy/:id', JenkinsController.destroy);

/* Analytics Controller */
router.get('/analyze', AnalyticsController.analyzeById);

/* Price Controller */
router.post('/price/ec2', PriceController.getEc2Price);
router.post('/price/rds', PriceController.getRdsPrice);

module.exports = router;
