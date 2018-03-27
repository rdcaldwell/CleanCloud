/* eslint quote-props:0, comma-dangle: 0, indent:0 */
const ROUTER = require('express').Router();
const AUTH = require('express-jwt')({
  secret: '',
  userProperty: 'payload',
});

/* User Authorization Controllers */

// profile
ROUTER.get('/profile', (req, res) => {
  res.json([{
    'Tests': 'test'
  }]);
});

// register
ROUTER.post('/register', (req, res) => {
  res.json([{
    'SUCCESS': {
      '__v': 0,
      'name': 'name',
      'lastName': 'lastname',
      '_id': 'some-unique-id'
    }
  }]);
});

// login
ROUTER.post('/login', (req, res) => {
  res.json([{
    'SUCCESS': {
      '__v': 0,
      'name': 'name',
      'lastName': 'lastname',
      '_id': 'some-unique-id'
    }
  }]);
});

/* Janitor Controller */

// janitor run
ROUTER.post('/janitor/run', (req, res) => {
  res.json([{
    'SUCCESS': {
      '__v': 0,
      'name': 'name',
      'lastName': 'lastname',
      '_id': 'some-unique-id'
    }
  }]);
});

// login
ROUTER.get('/janitor/destroy/:id', (req, res) => {
  res.json([{
    'Tests': 'test'
  }]);
});

// login
ROUTER.get('/janitors', (req, res) => {
  res.json([{
    'Tests': 'test'
  }]);
});

/* EC2 Controller */

// Describe
ROUTER.get('/describe/ec2', (req, res) => {
  res.json([{
    'Groups': [],
    'Instances': [{
      'AmiLaunchIndex': 0,
      'ImageId': 'ami-10fd7020',
      'InstanceId': 'i-03ca172443e06c4e1',
      'InstanceType': 't1.micro',
      'KernelId': 'aki-98e26fa8',
      'LaunchTime': '2018-03-08T01:00:02.000Z',
      'Monitoring': {
        'State': 'disabled'
      },
      'Placement': {
        'AvailabilityZone': 'us-west-2a',
        'GroupName': '',
        'Tenancy': 'default'
      },
      'PrivateDnsName': 'ip-172-31-32-246.us-west-2.compute.internal',
      'PrivateIpAddress': '172.31.32.246',
      'ProductCodes': [

      ],
      'PublicDnsName': 'ec2-35-166-168-84.us-west-2.compute.amazonaws.com',
      'PublicIpAddress': '35.166.168.84',
      'State': {
        'Code': 16,
        'Name': 'running'
      },
      'StateTransitionReason': '',
      'SubnetId': 'subnet-28511460',
      'VpcId': 'vpc-6f574909',
      'Architecture': 'x86_64',
      'BlockDeviceMappings': [{
        'DeviceName': '/dev/sda1',
        'Ebs': {
          'AttachTime': '2018-03-08T01:00:03.000Z',
          'DeleteOnTermination': true,
          'Status': 'attached',
          'VolumeId': 'vol-0dce9b8abc3a655db'
        }
      }],
      'ClientToken': '',
      'EbsOptimized': false,
      'Hypervisor': 'xen',
      'ElasticGpuAssociations': [

      ],
      'NetworkInterfaces': [{
        'Association': {
          'IpOwnerId': 'amazon',
          'PublicDnsName': 'ec2-35-166-168-84.us-west-2.compute.amazonaws.com',
          'PublicIp': '35.166.168.84'
        },
        'Attachment': {
          'AttachTime': '2018-03-08T01:00:02.000Z',
          'AttachmentId': 'eni-attach-6e429e9c',
          'DeleteOnTermination': true,
          'DeviceIndex': 0,
          'Status': 'attached'
        },
        'Description': '',
        'Groups': [{
          'GroupName': 'default',
          'GroupId': 'sg-bb4e9fc7'
        }],
        'Ipv6Addresses': [

        ],
        'MacAddress': '06:a3:41:7b:7a:f6',
        'NetworkInterfaceId': 'eni-a8731d9f',
        'OwnerId': '451623778925',
        'PrivateDnsName': 'ip-172-31-32-246.us-west-2.compute.internal',
        'PrivateIpAddress': '172.31.32.246',
        'PrivateIpAddresses': [{
          'Association': {
            'IpOwnerId': 'amazon',
            'PublicDnsName': 'ec2-35-166-168-84.us-west-2.compute.amazonaws.com',
            'PublicIp': '35.166.168.84'
          },
          'Primary': true,
          'PrivateDnsName': 'ip-172-31-32-246.us-west-2.compute.internal',
          'PrivateIpAddress': '172.31.32.246'
        }],
        'SourceDestCheck': true,
        'Status': 'in-use',
        'SubnetId': 'subnet-28511460',
        'VpcId': 'vpc-6f574909'
      }],
      'RootDeviceName': '/dev/sda1',
      'RootDeviceType': 'ebs',
      'SecurityGroups': [{
        'GroupName': 'default',
        'GroupId': 'sg-bb4e9fc7'
      }],
      'SourceDestCheck': true,
      'Tags': [{
        'Key': 'Name',
        'Value': 'Test-rdc'
      }, {
        'Key': 'Context',
        'Value': 'Test'
      }],
      'VirtualizationType': 'paravirtual'
    }],
    'OwnerId': '451623778925',
    'ReservationId': 'r-0f77c9b7762381bbf'
  }]);
});

// context by id
ROUTER.get('/context/ec2/:id', (req, res) => {
  res.json([{
    'AmiLaunchIndex': 0,
    'ImageId': 'ami-10fd7020',
    'InstanceId': 'i-03ca172443e06c4e1',
    'InstanceType': 't1.micro',
    'KernelId': 'aki-98e26fa8',
    'LaunchTime': '2018-03-08T01:00:02.000Z',
    'Monitoring': {
      'State': 'disabled'
    },
    'Placement': {
      'AvailabilityZone': 'us-west-2a',
      'GroupName': '',
      'Tenancy': 'default'
    },
    'PrivateDnsName': 'ip-172-31-32-246.us-west-2.compute.internal',
    'PrivateIpAddress': '172.31.32.246',
    'ProductCodes': [

    ],
    'PublicDnsName': 'ec2-35-166-168-84.us-west-2.compute.amazonaws.com',
    'PublicIpAddress': '35.166.168.84',
    'State': {
      'Code': 16,
      'Name': 'running'
    },
    'StateTransitionReason': '',
    'SubnetId': 'subnet-28511460',
    'VpcId': 'vpc-6f574909',
    'Architecture': 'x86_64',
    'BlockDeviceMappings': [{
      'DeviceName': '/dev/sda1',
      'Ebs': {
        'AttachTime': '2018-03-08T01:00:03.000Z',
        'DeleteOnTermination': true,
        'Status': 'attached',
        'VolumeId': 'vol-0dce9b8abc3a655db'
      }
    }],
    'ClientToken': '',
    'EbsOptimized': false,
    'Hypervisor': 'xen',
    'ElasticGpuAssociations': [

    ],
    'NetworkInterfaces': [{
      'Association': {
        'IpOwnerId': 'amazon',
        'PublicDnsName': 'ec2-35-166-168-84.us-west-2.compute.amazonaws.com',
        'PublicIp': '35.166.168.84'
      },
      'Attachment': {
        'AttachTime': '2018-03-08T01:00:02.000Z',
        'AttachmentId': 'eni-attach-6e429e9c',
        'DeleteOnTermination': true,
        'DeviceIndex': 0,
        'Status': 'attached'
      },
      'Description': '',
      'Groups': [{
        'GroupName': 'default',
        'GroupId': 'sg-bb4e9fc7'
      }],
      'Ipv6Addresses': [

      ],
      'MacAddress': '06:a3:41:7b:7a:f6',
      'NetworkInterfaceId': 'eni-a8731d9f',
      'OwnerId': '451623778925',
      'PrivateDnsName': 'ip-172-31-32-246.us-west-2.compute.internal',
      'PrivateIpAddress': '172.31.32.246',
      'PrivateIpAddresses': [{
        'Association': {
          'IpOwnerId': 'amazon',
          'PublicDnsName': 'ec2-35-166-168-84.us-west-2.compute.amazonaws.com',
          'PublicIp': '35.166.168.84'
        },
        'Primary': true,
        'PrivateDnsName': 'ip-172-31-32-246.us-west-2.compute.internal',
        'PrivateIpAddress': '172.31.32.246'
      }],
      'SourceDestCheck': true,
      'Status': 'in-use',
      'SubnetId': 'subnet-28511460',
      'VpcId': 'vpc-6f574909'
    }],
    'RootDeviceName': '/dev/sda1',
    'RootDeviceType': 'ebs',
    'SecurityGroups': [{
      'GroupName': 'default',
      'GroupId': 'sg-bb4e9fc7'
    }],
    'SourceDestCheck': true,
    'Tags': [{
      'Key': 'Name',
      'Value': 'Test-rdc'
    },
      {
        'Key': 'Context',
        'Value': 'Test'
      }
    ],
    'VirtualizationType': 'paravirtual'
  }]);
});

// context
ROUTER.get('/context/names', (req, res) => {
  res.json({
    'names': ['Test']
  });
});

// create
ROUTER.get('/create/ec2', (req, res) => {
  res.json([{
    'Tests': 'test'
  }]);
});

// terminate
ROUTER.get('/terminate/ec2/:id', (req, res) => {
  res.json([{
    'Tests': 'test'
  }]);
});

// analyze
ROUTER.get('/analyze/ec2/:id', (req, res) => {
  res.json([{
    'Tests': 'test'
  }]);
});


/* EFS Controller */

// describe by id
ROUTER.get('/describe/tags/efs/:id', (req, res) => {
  res.json([{
    'Key': 'Context',
    'Value': 'Test'
  }, {
    'Key': 'Name',
    'Value': 'Test-rdc'
  }]);
});

// describe
ROUTER.get('/describe/efs', (req, res) => {
  res.json([{
    'OwnerId': '451623778925',
    'CreationToken': 'tokenstring',
    'FileSystemId': 'fs-c19861b8',
    'CreationTime': '2018-03-08T01:18:03.000Z',
    'LifeCycleState': 'available',
    'Name': 'Test-rdc',
    'NumberOfMountTargets': 0,
    'SizeInBytes': {
      'Value': 6144,
      'Timestamp': null
    },
    'PerformanceMode': 'generalPurpose',
    'Encrypted': false
  }]);
});

// create efs
ROUTER.get('/create/efs', (req, res) => {
  res.json([{
    'Tests': 'test'
  }]);
});

// terminate by id
ROUTER.get('/terminate/efs/:id', (req, res) => {
  res.json([{
    'Tests': 'test'
  }]);
});


/* RDS Controller */

// describe by id
ROUTER.get('/describe/tags/rds/:id', (req, res) => {
  res.json([{
    'Key': 'Context',
    'Value': 'Test'
  }, {
    'Key': 'Name',
    'Value': 'Test-rdc'
  }]);
});

// describe
ROUTER.get('/describe/rds', (req, res) => {
  res.json([{
    'DBInstanceIdentifier': 'instance-test2',
    'DBInstanceClass': 'db.t2.micro',
    'Engine': 'postgres',
    'DBInstanceStatus': 'creating',
    'MasterUsername': 'rdc',
    'DBName': 'db_test2',
    'AllocatedStorage': 20,
    'PreferredBackupWindow': '03:47-04:17',
    'BackupRetentionPeriod': 1,
    'DBSecurityGroups': [],
    'VpcSecurityGroups': [{
      'VpcSecurityGroupId': 'sg-ec220084',
      'Status': 'active'
    }],
    'DBParameterGroups': [{
      'DBParameterGroupName': 'default.postgres9.6',
      'ParameterApplyStatus': 'in-sync'
    }],
    'AvailabilityZone': 'us-east-2a',
    'DBSubnetGroup': {
      'DBSubnetGroupName': 'default',
      'DBSubnetGroupDescription': 'default',
      'VpcId': 'vpc-3f847157',
      'SubnetGroupStatus': 'Complete',
      'Subnets': [{
        'SubnetIdentifier': 'subnet-cb493b86',
        'SubnetAvailabilityZone': {
          'Name': 'us-east-2c'
        },
        'SubnetStatus': 'Active'
      },
        {
          'SubnetIdentifier': 'subnet-59ee1031',
          'SubnetAvailabilityZone': {
            'Name': 'us-east-2a'
          },
          'SubnetStatus': 'Active'
        },
        {
          'SubnetIdentifier': 'subnet-8a9ba9f1',
          'SubnetAvailabilityZone': {
            'Name': 'us-east-2b'
          },
          'SubnetStatus': 'Active'
        }
      ]
    },
    'PreferredMaintenanceWindow': 'mon:09:05-mon:09:35',
    'PendingModifiedValues': {
      'MasterUserPassword': '****'
    },
    'MultiAZ': false,
    'EngineVersion': '9.6.5',
    'AutoMinorVersionUpgrade': true,
    'ReadReplicaDBInstanceIdentifiers': [],
    'ReadReplicaDBClusterIdentifiers': [],
    'LicenseModel': 'postgresql-license',
    'OptionGroupMemberships': [{
      'OptionGroupName': 'default: ostgres-9-6',
      'Status': 'in-sync'
    }],
    'PubliclyAccessible': true,
    'StatusInfos': [],
    'StorageType': 'standard',
    'DbInstancePort': 0,
    'StorageEncrypted': false,
    'DbiResourceId': 'db-QEYKFFPEV6LT65KBTDMKN2ZCQ4',
    'CACertificateIdentifier': 'rds-ca-2015',
    'DomainMemberships': [],
    'CopyTagsToSnapshot': false,
    'MonitoringInterval': 0,
    'DBInstanceArn': 'arn:aws:rds:us-east-2:451623778925:db:instance-test2',
    'IAMDatabaseAuthenticationEnabled': false,
    'PerformanceInsightsEnabled': false,
    'EnabledCloudwatchLogsExports': []
  }]);
});

// create rds
ROUTER.get('/create/rds', (req, res) => {
  res.json([{
    'Tests': 'test'
  }]);
});

// terminate by id
ROUTER.get('/terminate/rds/:id', (req, res) => {
  res.json([{
    'Tests': 'test'
  }]);
});


/* Jenkins Controller */

// destroy
ROUTER.get('/jenkins/destroy', (req, res) => {
  res.json([{
    'Tests': 'test'
  }]);
});


/* Cost Controllers */

// name
ROUTER.get('/cost/name', (req, res) => {
  res.json([{
    'Tests': 'test'
  }]);
});

// context
ROUTER.get('/cost/context', (req, res) => {
  res.json([{
    'Tests': 'test'
  }]);
});

// tags
ROUTER.get('/cost/tags', (req, res) => {
  res.json([{
    'Tests': 'test'
  }]);
});

module.exports = ROUTER;
