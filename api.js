const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const AWS = require('aws-sdk');
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

AWS.config.apiVersions = {
    costExplorer: '2017-10-25',
    ec2: '2016-11-15',
    cloudWatch: '2010-08-01',
};

/* GET instances */
ROUTER.get('/instances', (req, res) => {
    // Set the region
    AWS.config.update({region: 'us-west-2'});
    // Create EC2 service object
    var ec2 = new AWS.EC2();
    var instances = [];
    ec2.describeInstances(function(err, data) {
        if (err) {
            logger.error("Could not describe instances", err);
            return;
        }
        res.send(data.Reservations);
    });
});

/* Create Instance by id */
ROUTER.get('/create', (req, res) => {
    // Set the region
    AWS.config.update({region: 'us-west-2'});
    // Create EC2 service object
    var ec2 = new AWS.EC2();
    var instanceId = '';
    var instances = {};
    var params = {
        ImageId: 'ami-10fd7020', // amzn-ami-2011.09.1.x86_64-ebs
        InstanceType: 't1.micro',
        MinCount: 1,
        MaxCount: 1
    };
    // Create the instance
    ec2.runInstances(params, function(err, data) {
        if (err) {
            logger.debug("Could not create instance", err);
            return;
        }
        instanceId = data.Instances[0].InstanceId;
        // Add tags to the instance
        params = {Resources: [instanceId], Tags: [
            {
                Key: 'Name',
                Value: "Test"
            }
        ]};
        ec2.createTags(params, function(err) {
            logger.error("Tagging instance", err ? "failure" : "success");
        });
        logger.info(instanceId + " created");
        res.send(data.Instances[0]);
    });
});

/* Terminate Instances by id */
ROUTER.get('/terminate/:id', (req, res) => {
    var InstanceValue = req.params.id;
    // Set the region
    AWS.config.update({region: 'us-west-2'});
    // Create EC2 service object
    var ec2 = new AWS.EC2();
    var instanceIds = [];
    instanceIds.push(InstanceValue)
    var params = {
        InstanceIds: instanceIds,
        DryRun: false
    };
    // Create the instance
    ec2.terminateInstances(params, function(err, data) {
        if (err) {
            logger.error("Could not terminate instances", err);
            return;
        }
        logger.info(InstanceValue + " terminated");
    });
});

/* Analyze by id */
ROUTER.get('/analyze/:id', (req, res) => {
    var InstanceValue = req.params.id;
    log.debug("analyzing " + InstanceValue);
    // Set the region
    AWS.config.update({region: 'us-west-2'});
    var cloudWatch = new AWS.CloudWatch();
    var params = {
        EndTime: new Date(), /* required */
        MetricName: 'CPUUtilization', /* required */
        Namespace: 'AWS/EC2', /* required */
        Period: 600, /* required */
        StartTime: new Date('January 24, 2018 03:24:00'), /* required */
        Dimensions: [
            {
                Name: 'InstanceId', /* required */
                Value: InstanceValue /* required */
            },
        ],
        Statistics: [
            "Average",
        ],
        Unit: "Percent"
    };
    cloudWatch.getMetricStatistics(params, function(err, data) {
        if (err) logger.error(err, err.stack); // an error occurred
        else {
            logger.info(JSON.stringify(data, null, "\t")); // successful response
            res.send(data);
        } 
    });
});

/* GET Cost 
ROUTER.get('/cost', (req, res) => {
    // Set the region
    AWS.config.update({region: 'us-east-1'});
    var costExplorer = new AWS.CostExplorer();
    var params = {
        Metrics: ['BlendedCost'],
        Granularity: "MONTHLY",
        TimePeriod: {
            End: '2018-01-17',
            Start: '2017-11-01'
        }
    };
    costExplorer.getCostAndUsage(params, function(err, data) {
        if (err) res.send(err, err.stack); // an error occurred
        else     res.send(JSON.stringify(data)); // successful response
    });
});

/* Cost by id 
ROUTER.get('/cost/:id', (req, res) => {
    // Set the region
    AWS.config.update({region: 'us-east-1'});
    var costExplorer = new AWS.CostExplorer();
    var params = {
        Metrics: ['BlendedCost'],
        Granularity: "MONTHLY",
        TimePeriod: {
            End: '2018-01-17',
            Start: '2017-11-01'
        }
    };
    costExplorer.getCostAndUsage(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(JSON.stringify(data)); // successful response
    });
});
*/
module.exports = ROUTER;