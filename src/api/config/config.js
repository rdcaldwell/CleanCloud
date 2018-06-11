const config = {
  regions: [
    'us-east-1',
    'ap-southeast-2',
  ],
  environment: 'PROD', // DEV or PROD
  interval: 90000, // milliseconds
  leashed: true,
  threshold: 1,
  thresholdUnit: 'minute',
  destroyAfter: 1,
  destroyAfterUnit: 'minute',
  ldapUrl: 'ldap://localhost:389',
  bindDn: 'cn=admin,dc=planetexpress,dc=com',
  searchBase: 'ou=people,dc=planetexpress,dc=com',
  smtpServer: 'smtp.gmail.com',
  smtpPort: 465,
};

module.exports = config;
