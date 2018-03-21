import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { RdsComponent, RDSInstance } from './rds.component';
import { FormsModule } from '@angular/forms';
import { AmazonWebService } from '../services/amazonweb.service';
import { MockBackend } from '@angular/http/testing';
import { HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MomentModule } from 'angular2-moment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import * as moment from 'moment';

describe('RdsComponent', () => {
  let component: RdsComponent;
  let fixture: ComponentFixture<RdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RdsComponent],
      imports: [FormsModule, HttpModule, MomentModule],
      providers: [AmazonWebService,
        { provide: XHRBackend, useClass: MockBackend }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create RDS component', () => {
    expect(component).toBeTruthy();
  });

  it('should update status from creating to available',
    fakeAsync(inject([AmazonWebService, XHRBackend],
      (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {

        const mockResponse = [{
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
        }];

        component.rdsInstances.push({
          id: 'instance-test2',
          context: '',
          name: 'db_test2',
          type: 'RDS',
          engine: 'postgres',
          zone: 'us-west-2',
          status: 'creating',
          creationDate: '2017-03-18T17:40:10.346z',
          runningHours: 1,
          cost: 1,
          checked: true
        });

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        component.updateStatus();
        expect(component.rdsInstances[0].status).toEqual('available');
      })));

  it('should have no data for updateStatus', fakeAsync(inject([AmazonWebService, XHRBackend],
    (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {

      const mockResponse = 'No rds data';

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      component.updateStatus();
      expect(component.responseFromAWS).toEqual(mockResponse);
    })));

  it('should createInstance', fakeAsync(inject([AmazonWebService, XHRBackend],
    (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {

      const mockResponse = 'instance-test2 created';

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      component.createInstance();
      expect(component.responseFromAWS).toEqual(mockResponse);
    })));

  it('should terminateInstances with instance checked',
    fakeAsync(inject([AmazonWebService, XHRBackend],
      (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {

        const mockResponse = 'instance-test2 terminated';

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        component.rdsInstances.push({
          id: 'instance-test2',
          context: '',
          name: 'db_test2',
          type: 'RDS',
          engine: 'postgres',
          zone: 'us-west-2',
          status: 'available',
          creationDate: '2017-03-18T17:40:10.346z',
          runningHours: 1,
          cost: 1,
          checked: true
        });

        component.terminateInstances();
        expect(component.responseFromAWS).toEqual(mockResponse);
      })));

  it('should terminateInstances with instance not checked', () => {
    component.rdsInstances.push({
      id: 'instance-test2',
      context: '',
      name: 'instance-test2',
      type: 'RDS',
      engine: 'postgres',
      zone: 'us-west-2',
      status: 'available',
      creationDate: '2017-03-18T17:40:10.346z',
      runningHours: 1,
      cost: 1,
      checked: false
    });

    component.terminateInstances();
    expect(component.responseFromAWS).toEqual('No instances checked for termination');
  });

  /**
   * Not sure what the expectation condition should be since time changes
   */
  it('should get running hours', () => {
    const startTime = '2018-03-08T01:00:02.000Z';
    const test = component.getRunningHours(startTime);
    let runningHours = moment.duration(moment().diff(startTime)).asHours();
    runningHours = Math.round(runningHours * 100) / 100;
    expect(test).toEqual(runningHours);
  });

  it('should setup rds instances', async(inject([AmazonWebService, XHRBackend],
    (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {

      const mockResponse = [{
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
      }];

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      const getHours = new Promise((resolve) => {
        resolve(component.getRunningHours('2018-03-18T17:40:10.346Z'));
      });

      getHours.then((hours: number) => {
        spyOn(component, 'getCost').and.returnValue(0.02 * hours);

        const setUpInstance = new Promise((resolve) => {
          resolve({
            id: 'instance-test2',
            context: '',
            name: 'db_test2',
            type: 'db.t2.micro',
            engine: 'postgres',
            zone: 'us-east-2a',
            status: 'available',
            creationDate: '2018-03-18T17:40:10.346Z',
            runningHours: hours,
            cost: hours * 0.02,
            checked: false
          });
        });

        setUpInstance.then((mockRdsInstance: RDSInstance) => {
          new Promise((resolve) => {
            component.ngOnInit();
          }).then(() => {
            expect(component.rdsInstances[0]).toEqual(mockRdsInstance);
          });
        });
      });
    })));

  it('should not setup rds instances with no rds data', async(inject([AmazonWebService, XHRBackend],
    (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {

      const mockResponse = 'No rds data';

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      component.ngOnInit();
      expect(component.responseFromAWS).toEqual(mockResponse);
    })));

  it('should get cost', async(inject([AmazonWebService, XHRBackend],
    (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {
      spyOn(amazonWebService, 'getPrice').and.callFake(() => {
        return Observable.of(0.02);
      });
      const cost = component.getCost(40, {});
      expect(cost).toEqual(40 * 0.02);
    })));
});
