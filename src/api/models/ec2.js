var mongoose = require( 'mongoose' );

var ec2Schema = new mongoose.Schema({
    identifier: String,
    context: String,
    type: String,
    availabilityZone: String,
    status: String,
    dns: String,
    creationDate: String
});

mongoose.model('EC2', ec2Schema);