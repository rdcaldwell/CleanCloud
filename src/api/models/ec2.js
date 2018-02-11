var mongoose = require( 'mongoose' );
const LOG4JS = require('log4js');
const LOGGER = LOG4JS.getLogger();
LOGGER.level = 'debug';

var ec2Schema = new mongoose.Schema({
    identifier: {
        type:String,
        unique: true
    },
    context: String,
    type: String,
    availabilityZone: String,
    status: String,
    dns: String,
    createdOn: String,
    startedBy: String,
    orgImportPath: String,
    version: String,
    reason: String,
    highAvailability: String,
    monitor: Boolean
});

mongoose.model('EC2', ec2Schema);