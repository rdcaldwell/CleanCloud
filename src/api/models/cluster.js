var mongoose = require( 'mongoose' );
const LOG4JS = require('log4js');
const LOGGER = LOG4JS.getLogger();
LOGGER.level = 'debug';

var ClusterSchema = new mongoose.Schema({
    name: String,
    monitored: Boolean,
    createdOn: String,
    startedBy: String,
    version: String,
    EC2: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EC2' }],
    EFS: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EFS' }],
    RDS: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RDS' }],
});

mongoose.model('Cluster', ClusterSchema);