import {async, ComponentFixture, fakeAsync, inject, TestBed} from '@angular/core/testing';

import { ClusterComponent } from './cluster.component';
import {AmazonWebService} from '../services/amazonweb.service';
import {HttpModule, Response, ResponseOptions, XHRBackend} from '@angular/http';
import {MockBackend} from '@angular/http/testing';

describe('ClusterComponent', () => {
  let component: ClusterComponent;
  let fixture: ComponentFixture<ClusterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClusterComponent ],
      imports: [HttpModule],
      providers: [AmazonWebService,
        { provide: XHRBackend, useClass: MockBackend }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.clusterInstances = [];
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should terminate all instances within cluster using AWS',
    fakeAsync(inject([AmazonWebService, XHRBackend],
      (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {
        const mockResponse = 'instance terminated';

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        component.clusterInstances.push({
          serviceType: 'ec2',
          id: 'test-id',
          name: 'test',
          status: 'available',
        });

        component.terminateClusterAWS();

        expect(component.responseFromAWS).toEqual(mockResponse);
      })));

  it('should terminate all instances within cluster using AWS',
    fakeAsync(inject([AmazonWebService, XHRBackend],
      (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {
        const mockResponse = 'instance terminated';

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        component.clusterInstances.push({
          serviceType: 'ec2',
          id: 'test-id',
          name: 'test',
          status: 'available',
        });

        component.terminateClusterJenkins();

        expect(component.responseFromAWS).toEqual(mockResponse);
      })));

  it('should get cluster name', () => {
    const tags = [{Key: 'test', Value: '1'}, {Key: 'Name', Value: 'clusterName'}];

    const output = component.getName(tags);

    expect(output).toEqual('clusterName');
  });

  it('should not get cluster name', () => {
    const tags = [{Key: 'test', Value: 1}, {Key: '2', Value: 'test'}];

    const output = component.getName(tags);

    expect(output).toEqual(undefined);
  });

  it('should have no ec2 data', fakeAsync(inject([AmazonWebService, XHRBackend],
    (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {
      const mockResponse = 'No ec2 data';

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      component.getEC2Context();

      expect(component.responseFromAWS).toEqual(mockResponse);
    })));

  it('should have no rds data', fakeAsync(inject([AmazonWebService, XHRBackend],
    (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {
      const mockResponse = 'No rds data';

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      component.getRDSContext();

      expect(component.responseFromAWS).toEqual(mockResponse);
    })));

  it('should have no efs data', fakeAsync(inject([AmazonWebService, XHRBackend],
    (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {
      const mockResponse = 'No efs data';

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      component.getEFSContext();

      expect(component.responseFromAWS).toEqual(mockResponse);
    })));

  // Todo response needs fixed
  it('should not add an EFS instance to clusterInstances', fakeAsync(inject([AmazonWebService, XHRBackend],
    (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {
      const mockResponse = [
        {
          'Key': 'Context',
          'Value': 'Test'
        },
        {
          'Key': 'Name',
          'Value': 'Test-efs'
        },
        {
          'Key': 'LifeCycleState',
          'Value': 'testLife'
        },
        {
          'Key': 'FileSystemID',
          'Value': 'ID'
        }
      ];

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      component.getEFSContext();

      expect(component.clusterInstances).toEqual([]);
    })));

  // Todo response needs fixed
  it('should add an EC2 instance to clusterInstances', fakeAsync(inject([AmazonWebService, XHRBackend],
    (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {
      const mockResponse = [
        {
          'Groups': [],
          'Instances': [
            {
              'AmiLaunchIndex': 0,
              'ImageId': 'ami-1853ac65',
              'InstanceId': 'i-090fa76267723011c',
              'InstanceType': 't2.micro',
              'LaunchTime': '2018-03-23T01:50:20.000Z',
              'Monitoring': {
                'State': 'disabled'
              },
              'Placement': {
                'AvailabilityZone': 'us-east-1b',
                'GroupName': '',
                'Tenancy': 'default'
              },
              'PrivateDnsName': 'ip-172-31-82-212.ec2.internal',
              'PrivateIpAddress': '172.31.82.212',
              'ProductCodes': [],
              'PublicDnsName': 'ec2-35-174-167-57.compute-1.amazonaws.com',
              'PublicIpAddress': '35.174.167.57',
              'State': {
                'Code': 0,
                'Name': 'pending'
              },
              'StateTransitionReason': '',
              'SubnetId': 'subnet-0e89c221',
              'VpcId': 'vpc-1c32f267',
              'Architecture': 'x86_64',
              'BlockDeviceMappings': [
                {
                  'DeviceName': '/dev/xvda',
                  'Ebs': {
                    'AttachTime': '2018-03-23T01:50:21.000Z',
                    'DeleteOnTermination': true,
                    'Status': 'attaching',
                    'VolumeId': 'vol-060af87d51844d2eb'
                  }
                }
              ],
              'ClientToken': '',
              'EbsOptimized': false,
              'EnaSupport': true,
              'Hypervisor': 'xen',
              'ElasticGpuAssociations': [],
              'NetworkInterfaces': [
                {
                  'Association': {
                    'IpOwnerId': 'amazon',
                    'PublicDnsName': 'ec2-35-174-167-57.compute-1.amazonaws.com',
                    'PublicIp': '35.174.167.57'
                  },
                  'Attachment': {
                    'AttachTime': '2018-03-23T01:50:20.000Z',
                    'AttachmentId': 'eni-attach-ef621620',
                    'DeleteOnTermination': true,
                    'DeviceIndex': 0,
                    'Status': 'attaching'
                  },
                  'Description': '',
                  'Groups': [
                    {
                      'GroupName': 'default',
                      'GroupId': 'sg-321d4145'
                    }
                  ],
                  'Ipv6Addresses': [],
                  'MacAddress': '12:70:51:11:7f:e4',
                  'NetworkInterfaceId': 'eni-5ca112dd',
                  'OwnerId': '717002997396',
                  'PrivateDnsName': 'ip-172-31-82-212.ec2.internal',
                  'PrivateIpAddress': '172.31.82.212',
                  'PrivateIpAddresses': [
                    {
                      'Association': {
                        'IpOwnerId': 'amazon',
                        'PublicDnsName': 'ec2-35-174-167-57.compute-1.amazonaws.com',
                        'PublicIp': '35.174.167.57'
                      },
                      'Primary': true,
                      'PrivateDnsName': 'ip-172-31-82-212.ec2.internal',
                      'PrivateIpAddress': '172.31.82.212'
                    }
                  ],
                  'SourceDestCheck': true,
                  'Status': 'in-use',
                  'SubnetId': 'subnet-0e89c221',
                  'VpcId': 'vpc-1c32f267'
                }
              ],
              'RootDeviceName': '/dev/xvda',
              'RootDeviceType': 'ebs',
              'SecurityGroups': [
                {
                  'GroupName': 'default',
                  'GroupId': 'sg-321d4145'
                }
              ],
              'SourceDestCheck': true,
              'Tags': [
                {
                  'Key': 'Name',
                  'Value': 'Test-rdc'
                },
                {
                  'Key': 'Context',
                  'Value': 'Test'
                }
              ],
              'VirtualizationType': 'hvm'
            }
          ],
          'OwnerId': '717002997396',
          'ReservationId': 'r-05c5582c9b16b9574'
        }
      ];

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      component.getEC2Context();
      expect(component.clusterInstances[0].serviceType).toEqual('ec2');
      expect(component.clusterInstances[0].id).toEqual('i-090fa76267723011c');
    })));

  // Todo response needs fixed
  it('should add an RDS instance to clusterInstances', fakeAsync(inject([AmazonWebService, XHRBackend],
    (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {
      const mockResponse = [
        {
          'DBInstanceIdentifier': 'instance-test2',
          'DBInstanceClass': 'db.t2.micro',
          'Engine': 'postgres',
          'DBInstanceStatus': 'available',
          'MasterUsername': 'rdc',
          'DBName': 'db_test2',
          'Endpoint': {
            'Address': 'instance-test2.chpt9vjm2ntg.us-east-2.rds.amazonaws.com',
            'Port': 5432,
            'HostedZoneId': 'Z2XHWR1WZ565X2'
          },
          'AllocatedStorage': 20,
          'InstanceCreateTime': '2018-03-18T17:40:10.346Z',
          'PreferredBackupWindow': '08:17-08:47',
          'BackupRetentionPeriod': 1,
          'DBSecurityGroups': [],
          'VpcSecurityGroups': [
            {
              'VpcSecurityGroupId': 'sg-0bc27160',
              'Status': 'active'
            }
          ],
          'DBParameterGroups': [
            {
              'DBParameterGroupName': 'default.postgres9.6',
              'ParameterApplyStatus': 'in-sync'
            }
          ],
          'AvailabilityZone': 'us-east-2a',
          'DBSubnetGroup': {
            'DBSubnetGroupName': 'default',
            'DBSubnetGroupDescription': 'default',
            'VpcId': 'vpc-b1d462d9',
            'SubnetGroupStatus': 'Complete',
            'Subnets': [
              {
                'SubnetIdentifier': 'subnet-0e351643',
                'SubnetAvailabilityZone': {
                  'Name': 'us-east-2c'
                },
                'SubnetStatus': 'Active'
              },
              {
                'SubnetIdentifier': 'subnet-d18a3ab9',
                'SubnetAvailabilityZone': {
                  'Name': 'us-east-2a'
                },
                'SubnetStatus': 'Active'
              },
              {
                'SubnetIdentifier': 'subnet-6ef21914',
                'SubnetAvailabilityZone': {
                  'Name': 'us-east-2b'
                },
                'SubnetStatus': 'Active'
              }
            ]
          },
          'PreferredMaintenanceWindow': 'tue:03:11-tue:03:41',
          'PendingModifiedValues': {},
          'LatestRestorableTime': '2018-03-18T17:46:37.000Z',
          'MultiAZ': false,
          'EngineVersion': '9.6.5',
          'AutoMinorVersionUpgrade': true,
          'ReadReplicaDBInstanceIdentifiers': [],
          'ReadReplicaDBClusterIdentifiers': [],
          'LicenseModel': 'postgresql-license',
          'OptionGroupMemberships': [
            {
              'OptionGroupName': 'default:postgres-9-6',
              'Status': 'in-sync'
            }
          ],
          'PubliclyAccessible': true,
          'StatusInfos': [],
          'StorageType': 'standard',
          'DbInstancePort': 0,
          'StorageEncrypted': false,
          'DbiResourceId': 'db-S4OORBNCZNDT67GV3ROCI4SQCI',
          'CACertificateIdentifier': 'rds-ca-2015',
          'DomainMemberships': [],
          'CopyTagsToSnapshot': false,
          'MonitoringInterval': 0,
          'DBInstanceArn': 'arn:aws:rds:us-east-2:717002997396:db:instance-test2',
          'IAMDatabaseAuthenticationEnabled': false,
          'PerformanceInsightsEnabled': false,
          'EnabledCloudwatchLogsExports': []
        }
      ];

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      component.getRDSContext();

      expect(component.clusterInstances[0].id).toEqual('instance-test2');
      expect(component.clusterInstances[0].serviceType).toEqual('rds');
    })));

  // Todo response needs fixed
  it('should not add an RDS instance to clusterInstances', fakeAsync(inject([AmazonWebService, XHRBackend],
    (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {
      const mockResponse = [
        {
          'DBInstanceIdentifier': 'instance-test2',
          'DBInstanceClass': 'db.t2.micro',
          'Engine': 'postgres',
          'DBInstanceStatus': 'available',
          'MasterUsername': 'rdc',
          'DBName': 'db_test2',
          'Endpoint': {
            'Address': 'instance-test2.chpt9vjm2ntg.us-east-2.rds.amazonaws.com',
            'Port': 5432,
            'HostedZoneId': 'Z2XHWR1WZ565X2'
          },
          'AllocatedStorage': 20,
          'InstanceCreateTime': '2018-03-18T17:40:10.346Z',
          'PreferredBackupWindow': '08:17-08:47',
          'BackupRetentionPeriod': 1,
          'DBSecurityGroups': [],
          'VpcSecurityGroups': [
            {
              'VpcSecurityGroupId': 'sg-0bc27160',
              'Status': 'active'
            }
          ],
          'DBParameterGroups': [
            {
              'DBParameterGroupName': 'default.postgres9.6',
              'ParameterApplyStatus': 'in-sync'
            }
          ],
          'AvailabilityZone': 'us-east-2a',
          'DBSubnetGroup': {
            'DBSubnetGroupName': 'default',
            'DBSubnetGroupDescription': 'default',
            'VpcId': 'vpc-b1d462d9',
            'SubnetGroupStatus': 'Complete',
            'Subnets': [
              {
                'SubnetIdentifier': 'subnet-0e351643',
                'SubnetAvailabilityZone': {
                  'Name': 'us-east-2c'
                },
                'SubnetStatus': 'Active'
              },
              {
                'SubnetIdentifier': 'subnet-d18a3ab9',
                'SubnetAvailabilityZone': {
                  'Name': 'us-east-2a'
                },
                'SubnetStatus': 'Active'
              },
              {
                'SubnetIdentifier': 'subnet-6ef21914',
                'SubnetAvailabilityZone': {
                  'Name': 'us-east-2b'
                },
                'SubnetStatus': 'Active'
              }
            ]
          },
          'PreferredMaintenanceWindow': 'tue:03:11-tue:03:41',
          'PendingModifiedValues': {},
          'LatestRestorableTime': '2018-03-18T17:46:37.000Z',
          'MultiAZ': false,
          'EngineVersion': '9.6.5',
          'AutoMinorVersionUpgrade': true,
          'ReadReplicaDBInstanceIdentifiers': [],
          'ReadReplicaDBClusterIdentifiers': [],
          'LicenseModel': 'postgresql-license',
          'OptionGroupMemberships': [
            {
              'OptionGroupName': 'default:postgres-9-6',
              'Status': 'in-sync'
            }
          ],
          'PubliclyAccessible': true,
          'StatusInfos': [],
          'StorageType': 'standard',
          'DbInstancePort': 0,
          'StorageEncrypted': false,
          'DbiResourceId': 'db-S4OORBNCZNDT67GV3ROCI4SQCI',
          'CACertificateIdentifier': 'rds-ca-2015',
          'DomainMemberships': [],
          'CopyTagsToSnapshot': false,
          'MonitoringInterval': 0,
          'DBInstanceArn': 'arn:aws:rds:us-east-2:717002997396:db:instance-test2',
          'IAMDatabaseAuthenticationEnabled': false,
          'PerformanceInsightsEnabled': false,
          'EnabledCloudwatchLogsExports': []
        }
      ];

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      component.title = 'Test-rds';
      component.getRDSContext();

      expect(component.clusterInstances).toEqual([]);
    })));

  // Todo Isn't setting id, name, and status, response is wrong
  it('should add an EFS instance to clusterInstances', fakeAsync(inject([AmazonWebService, XHRBackend],
    (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {
      const mockResponse = [
        {
          'Key': 'context',
          'Value': 'Test'
        },
        {
          'Key': 'name',
          'Value': 'Test-efs'
        },
        {
          'Key': 'lifecyclestate',
          'Value': 'available'
        },
        {
          'Key': 'filesystemid',
          'Value': 'ID'
        }
      ];

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      component.title = 'Test-efs';
      component.getEFSContext();

      expect(component.clusterInstances[0].serviceType).toEqual('efs');
    })));
});
