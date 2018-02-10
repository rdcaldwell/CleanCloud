var mongoose = require( 'mongoose' );

var rdsSchema = new mongoose.Schema({
    identifier: String,
    name: String,
    context: String,
    class: String,
    engine: String,
    status: String,
    availabilityZone: String,
    creationDate: String
});

mongoose.model('RDS', rdsSchema);