var mongoose = require( 'mongoose' );

var ec2Schema = new mongoose.Schema({
    identifier: String,
    context: String,
    type: String,
    availabilityZone: String,
    status: String,
    dns: String,
    createdON: String,
    startedBy: String,
    orgImportPath: String,
    version: String,
    reason: String,
    highAvailability: String
});

mongoose.model('EC2', ec2Schema);