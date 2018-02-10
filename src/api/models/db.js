var mongoose = require('mongoose');
var db = 'mongodb://admin:password@ds121543.mlab.com:21543/fischerjanitor';

mongoose.connect(db);

mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + db);
});

mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
});

require('./users');