import { async, ComponentFixture, fakeAsync, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Ec2Component, EC2Instance } from './ec2.component';
import { MomentModule } from 'angular2-moment';
import { AmazonWebService } from '../services/amazonweb.service';
import { HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MatDialogModule } from '@angular/material';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

describe('Ec2Component', () => {
  let component: Ec2Component;
  let fixture: ComponentFixture<Ec2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, MomentModule, HttpModule, MatDialogModule],
      declarations: [Ec2Component],
      providers: [AmazonWebService,
        { provide: XHRBackend, useClass: MockBackend }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ec2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should run updateInstances on init', () => {
    const spy = spyOn(component, 'updateInstances');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should terminateInstances with instance checked',
    fakeAsync(inject([AmazonWebService, XHRBackend],
      (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {
        const mockResponse = 'instance-test2 terminated';

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        component.ec2Instances.push({
          id: 'test',
          context: '',
          name: 'test',
          type: 'ec2',
          dns: 'd',
          zone: 'us-west-2',
          status: 'available',
          creationDate: new Date(),
          runningHours: 1,
          cost: 1,
          checked: true
        });

        component.terminateInstances();

        expect(component.responseFromAWS).toEqual(mockResponse);
      })));

  it('should not terminateInstances with instance not checked', () => {
    component.ec2Instances.push({
      id: 'test',
      context: '',
      name: 'test',
      type: 'ec2',
      dns: 'd',
      zone: 'us-west-2',
      status: 'available',
      creationDate: new Date(),
      runningHours: 1,
      cost: 1,
      checked: false
    });

    component.terminateInstances();

    expect(component.responseFromAWS).toEqual('No instances checked for termination');
  });

  it('should have different ec2 IDs and status will not be updated',
    fakeAsync(inject([AmazonWebService, XHRBackend],
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
                  'Name': 'available'
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

        component.ec2Instances.push({
          id: 'test',
          context: '',
          name: 'test',
          type: 't2.micro',
          dns: 'd',
          zone: 'us-west-2',
          status: 'creating',
          creationDate: new Date(),
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

        expect(component.ec2Instances[0].status).toEqual('creating');
      })));

  it('should update status from creating to available',
    fakeAsync(inject([AmazonWebService, XHRBackend],
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
                  'Name': 'available'
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

        component.ec2Instances.push({
          id: 'i-090fa76267723011c',
          context: '',
          name: 'test',
          type: 't2.micro',
          dns: 'd',
          zone: 'us-west-2',
          status: 'creating',
          creationDate: new Date(),
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

        expect(component.ec2Instances[0].status).toEqual('available');
      })));

  it('should have no data for updateStatus', fakeAsync(inject([AmazonWebService, XHRBackend],
    (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {
      const mockResponse = 'No ec2 data';

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      component.updateStatus();

      expect(component.responseFromAWS).toEqual(mockResponse);
    })));

  it('should have no data for updateInstances', fakeAsync(inject([AmazonWebService, XHRBackend],
    (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {
      const mockResponse = 'No ec2 data';

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      component.updateInstances();

      expect(component.responseFromAWS).toEqual(mockResponse);
    })));

  it('should update Instance information',
    (inject([AmazonWebService, XHRBackend],
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
                'LaunchTime': '2018-02-23T01:50:20.000Z',
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
                  'Name': 'available'
                },
                'StateTransitionReason': '',
                'SubnetId': 'subnet-0e89c221',
                'VpcId': 'vpc-1c32f267',
                'Architecture': 'x86_64',
                'BlockDeviceMappings': [
                  {
                    'DeviceName': '/dev/xvda',
                    'Ebs': {
                      'AttachTime': '2018-02-23T01:50:21.000Z',
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

        const price = 0.02;
        const hours = 24;
        const cost = hours * price;

        spyOn(component, 'getRunningHours').and.returnValue(hours);
        spyOn(amazonWebService, 'getPrice').and.callFake(() => {
          return Observable.of(price);
        });

        const setUpInstance = new Promise((resolve) => {
          resolve({
            id: 'i-090fa76267723011c',
            context: '',
            name: 'Test-rdc',
            type: 't2.micro',
            dns: 'ec2-35-174-167-57.compute-1.amazonaws.com',
            zone: 'us-east-1b',
            status: 'available',
            creationDate: '2018-03-18T17:40:10.346Z',
            runningHours: hours,
            cost: cost,
            checked: false
          });
        });

        setUpInstance.then((mockEC2Instance: EC2Instance) => {
          new Promise((resolve) => {
            component.updateInstances();
          }).then(() => {
            console.log(component.ec2Instances[0]);
            expect(component.ec2Instances[0]).toEqual(mockEC2Instance);
          });
        });
      })));

  it('should get ec2 tags', () => {
    const tags = [{ Key: 'test', Value: '1' }, { Key: 'test2', Value: 2 }];

    const output = component.getTag(tags, 'test');

    expect(output).toEqual('1');
  });

  it('should not get ec2 tags', () => {
    const tags = [{ Key: 'test', Value: 1 }, { Key: 'test2', Value: 2 }];

    const output = component.getTag(tags, 'test3');

    expect(output).toEqual(undefined);
  });
});
