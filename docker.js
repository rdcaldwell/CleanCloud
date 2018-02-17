var run = require('docker-run')

var child = run('mlafeldt/simianarmy', {
    ports: { 
        8080: 8080 
    },   
    env: {
        SIMIANARMY_CLIENT_AWS_ACCOUNTKEY: 'AKIAJFNLMJXSJ4KLT6TQ',
        SIMIANARMY_CLIENT_AWS_SECRETKEY: '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',
        SIMIANARMY_CLIENT_AWS_REGION: 'us-west-2',
        SIMIANARMY_CALENDAR_ISMONKEYTIME: true,
        SIMIANARMY_CHAOS_ENABLED: false,
        SIMIANARMY_CHAOS_LEASHED: false,
        SIMIANARMY_JANITOR_ENABLED: true,
        SIMIANARMY_JANITOR_LEASHED: false,
        SIMIANARMY_JANITOR_NOTIFICATION_DEFAULTEMAIL: 'ronniecaldwell@yahoo.com',
        SIMIANARMY_JANITOR_SUMMARYEMAIL_TO: 'ronniecaldwell@yahoo.com',
        SIMIANARMY_JANITOR_NOTIFICATION_SOURCEEMAIL: 'ronniecaldwell@yahoo.com'
    }
});