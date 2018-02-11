const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const ASYNC = require('async');
const MONGOOSE = require('mongoose');
const LOG4JS = require('log4js');
const LOGGER = LOG4JS.getLogger();
LOGGER.level = 'debug';

var db_EC2 = MONGOOSE.model('EC2');;
var db_EFS = MONGOOSE.model('EFS');;
var db_RDS = MONGOOSE.model('RDS');;
var db_Cluster = MONGOOSE.model('Cluster');

const CTRL_PROFILE = require('../controllers/profile');
const CTRL_AUTH = require('../controllers/auth');
const JWT = require('express-jwt');
const AUTH = JWT({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

const AWS = require('aws-sdk');
const EC2 = new AWS.EC2({apiVersion: '2016-11-15', region: 'us-west-2'});
const EFS = new AWS.EFS({apiVersion: '2015-02-01', region: 'us-east-2'});
const RDS = new AWS.RDS({apiVersion: '2014-10-31', region: 'us-east-2'});
const CLOUD_WATCH = new AWS.CloudWatch({apiVersion: '2010-08-01', region: 'us-west-2'});
const COST_EXPLORER = new AWS.CostExplorer({apiVersion: '2017-10-25', region: 'us-east-1'});

ROUTER.get('/profile', AUTH, CTRL_PROFILE.profileRead);
ROUTER.post('/register', CTRL_AUTH.register);
ROUTER.post('/login', CTRL_AUTH.login);

/* GET EC2 instances */
ROUTER.get('/describe/ec2', (req, res) => {
    var isInserted = false;
    var ec2_collection = [];
    EC2.describeInstances(function(err, data) {
        if (err) {
            LOGGER.error("[DESCRIBE-EC2]\n " + err.stack);
            return;
        }
        else if (data.Reservations.length) {
            ASYNC.forEachOf(data.Reservations[0].Instances, function(describedInstance, index, callback) {
                removeTerminatedInstancesFromDb(data.Reservations[0].Instances);
                if (isDescribedInstanceInDb(db_EC2, describedInstance.InstanceId, describedInstance.State.Name) === false)
                    insertEC2(describedInstance);
                callback();
            }, function(err) {
                if (err) {
                    LOGGER.error(err);
                    return;
                }
                db_EC2.find({}, function(err, docs) {
                    res.send(docs);                                    
                });
            });

        }
    });
});

ROUTER.get('/clusters', (req, res) => {
    db_EC2.find({}, function(err, docs) {
        ASYNC.forEachOf(docs, function(doc, index, callback) {
            if (doc.context === "Test") {

            }
        });
    });        
}); 

function isDescribedInstanceInDb(db, serviceIdentifier, serviceStatus) {
    var alreadyRunning = false;
    db.find({ identifier: serviceIdentifier }, function(err, doc) {
        if (doc.length) {
            LOGGER.info(`${serviceIdentifier} ${alreadyRunning}`); 
            alreadyRunning = true;
            if (doc[0].status !== serviceStatus) {
                db.update({ identifier: serviceIdentifier }, { status: serviceStatus }, function(err, doc2) {
                    if (err) LOGGER.error(`Error updating ${doc[0].identifier}`)
                    else LOGGER.info(`${doc[0].identifier} updated to ${serviceStatus}`);   
                });
            }        
        }
        else {
            alreadyRunning = false;
        }
    });
    return alreadyRunning;
}


function removeTerminatedInstancesFromDb(db, instances) {
    db.find({}, function(err, table) {
        ASYNC.forEachOf(table, function(instance, index, callback) {
            if (isTerminated(instance.identifier, instances)) {
                db.find({ identifier: instance.identifier }).remove().exec();
                LOGGER.info("record removed");
            }         
        });
    });
}

function isTerminated(id, instances) {
    var terminated = true;
    ASYNC.forEachOf(instances, function(instance, index, callback) {    
        if (id === instance.InstanceId) terminated = false;
    });
    return terminated;
}

function insertEC2(instance) {
    var ec2 = new db_EC2();
    ec2.identifier = instance.InstanceId;
    ec2.context = instance.Tags[0].Value;
    ec2.type = instance.InstanceType;
    ec2.availabilityZone = instance.Placement.AvailabilityZone;
    ec2.status = instance.State.Name;
    ec2.dns = instance.PublicDnsName;
    ec2.createdOn = instance.LaunchTime;
    ec2.save(function(err) {
        if (err) LOGGER.error("Error adding " + instance.InstanceId)
        else LOGGER.info(ec2.identifier + " record added");                        
    });
}

/* GET EFS instances */
ROUTER.get('/describe/efs', (req, res) => {
    var params = {};
    EFS.describeFileSystems(params, function(err, data) {
        if (err) {
            LOGGER.error("[DESCRIBE-EFS]\n " + err.stack);
            return;
        }
        else if (data.FileSystems.length) {
            LOGGER.info("[DESCRIBE-EFS]\n" + JSON.stringify(data.FileSystems, null, "\t"));
            res.send(data.FileSystems);
        }
    });
});

/* GET RDS DB instances */
ROUTER.get('/describe/rds', (req, res) => {
    var params = {};
    RDS.describeDBInstances(params, function(err, data) {
        if (err) {
            LOGGER.error("[DESCRIBE-RDS]\n " + err.stack);
            return;
        }
        else if (data.DBInstances.length) {
            LOGGER.info("[DESCRIBE-RDS]\n" + JSON.stringify(data.DBInstances, null, "\t"));
            res.send(data.DBInstances);            
        }
    });
});

/* Create EC2 Instance */
ROUTER.get('/create/ec2', (req, res) => {
    var params = {
        ImageId: 'ami-10fd7020', // amzn-ami-2011.09.1.x86_64-ebs
        InstanceType: 't1.micro',
        MinCount: 1,
        MaxCount: 1
    };
    // Create the instance
    EC2.runInstances(params, function(err, data) {
        if (err) {
            LOGGER.error(err, err.stack);
            return;
        }
        else LOGGER.info(data);
        var instanceId = data.Instances[0].InstanceId;
        // Add tags to the instance
        params = {
            Resources: [instanceId], 
            Tags: [
                {
                    Key: 'Context',
                    Value: "Test"
                }
        ]};
        EC2.createTags(params, function(err) {
            LOGGER.info("Tagging instance", err ? "failure" : "success");
        });
        LOGGER.info(instanceId + " created");
        res.send(data.Instances[0]);
    });
});

/* Create EFS instance */
ROUTER.get('/create/efs', (req, res) => {
    var params = {
        CreationToken: "tokenstring", 
        PerformanceMode: "generalPurpose"
    };
    EFS.createFileSystem(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log("[CREATE-EFS]\n" + JSON.stringify(data, null, "\t"));           // successful response
        var tagParams = {
            FileSystemId: data.FileSystemId, 
            Tags: [{
                Key: "Context", 
                Value: "rdc-test"
            }]
        };
        EFS.createTags(tagParams, function(tagErr, tagData) {
            if (tagErr) console.log(tagErr, tagErr.stack); // an error occurred
            else     console.log(tagData);           // successful response
        });
    });
});

ROUTER.get('/create/rds', (req, res) => {
    var params = {
        DBInstanceClass: 'db.t2.micro',
        DBInstanceIdentifier: 'instance-test',
        Engine: 'postgres',
        EngineVersion: '9.6.5',
        AvailabilityZone: 'us-east-2a',
        DBName: 'db_test',
        MasterUsername: 'rdc',
        MasterUserPassword: 'password',
        AllocatedStorage: 20,
        Tags: [
          {
            Key: 'Context',
            Value: 'rdc-test'
          },
        ]
    };
    RDS.createDBInstance(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);  
        res.send(data);         // successful response
    });
});
 
/* Terminate EC2 Instances by id */
ROUTER.get('/terminate/ec2/:id', (req, res) => {
    var InstanceValue = req.params.id;
    var instanceIds = [];
    instanceIds.push(InstanceValue)
    var params = {
        InstanceIds: instanceIds,
        DryRun: false
    };
    // Create the instance
    EC2.terminateInstances(params, function(err, data) {
        if (err) {
            LOGGER.error("Could not terminate instances", err);
            return;
        }
        LOGGER.info(InstanceValue + " terminated");
    });
});

/* Terminate EFS Instances by id */
ROUTER.get('/terminate/efs/:id', (req, res) => {
    var params = {
        FileSystemId: req.params.id
    };
    EFS.deleteFileSystem(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
});

/* Terminate EFS Instances by id */
ROUTER.get('/terminate/rds/:id', (req, res) => {
    var params = {
        DBInstanceIdentifier: req.params.id, /* required */
        SkipFinalSnapshot: true
    };
    RDS.deleteDBInstance(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
});

/* Analyze EC2 instances by id */
ROUTER.get('/analyze/ec2/:id', (req, res) => {
    var params = {
        EndTime: new Date(), /* required */
        MetricName: 'CPUUtilization', /* required */
        Namespace: 'AWS/EC2', /* required */
        Period: 120, /* required */
        StartTime: new Date('February 07, 2018 03:24:00'), /* required */
        Dimensions: [
            {
                Name: 'InstanceId', /* required */
                Value: req.params.id /* required */
            },
        ],
        Statistics: [
            "Average",
        ],
        Unit: "Percent"
    };
    CLOUD_WATCH.getMetricStatistics(params, function(err, data) {
        if (err) LOGGER.error(err, err.stack); // an error occurred
        else {
            LOGGER.info(JSON.stringify(data, null, "\t")); // successful response
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

/*
function addRunningEC2InstancesToDb(instance) {
    db_EC2.find({ identifier: instance.InstanceId }, function(err, doc) {
        if (doc.length) {
            LOGGER.info(`${instance.InstanceId} exists`); 
            if (doc[0].status !== instance.State.Name) {
                db_EC2.update({ identifier: instance.InstanceId }, { status: instance.State.Name }, function(err, doc2) {
                    if (err) LOGGER.error(`Error updating ${doc[0].identifier}`)
                    else LOGGER.info(`${doc[0].identifier} updated to ${instance.State.Name}`);   
                });
            }        
        }
        else {
            insertEC2(instance)
        }
    });
}
*/

/*
function removeTerminatedEC2InstancesFromDb(instances) {
    db_EC2.find({}, function(err, ec2_table) {
        ASYNC.forEachOf(ec2_table, function(instance, index, callback) {
            if (isTerminated(instance.identifier, instances)) {
                db_EC2.find({ identifier: instance.identifier }).remove().exec();
                LOGGER.info("record removed");
            }         
        });
    });
}
*/

module.exports = ROUTER;