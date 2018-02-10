var mongoose = require( 'mongoose' );

var rdsSchema = new mongoose.Schema({
    identifier: String,
    name: String,
    context: String,
    class: String,
    engine: String,
    status: String,
    availabilityZone: String,
    createdOn: String,
    startedBy: String,
    orgImportPath: String,
    version: String,
    reason: String,
    highAvailability: String
});

mongoose.model('RDS', rdsSchema);