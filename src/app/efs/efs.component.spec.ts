import {async, ComponentFixture, fakeAsync, inject, TestBed} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import {EfsComponent, EFSInstance} from './efs.component';
import {MomentModule} from 'angular2-moment';
import {AmazonWebService} from '../services/amazonweb.service';
import {HttpModule, Response, ResponseOptions, XHRBackend} from '@angular/http';
import {MockBackend} from '@angular/http/testing';

describe('EfsComponent', () => {
  let component: EfsComponent;
  let fixture: ComponentFixture<EfsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, MomentModule, HttpModule ],
      declarations: [ EfsComponent ],
      providers: [AmazonWebService,
        { provide: XHRBackend, useClass: MockBackend }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EfsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no data for updateStatus', fakeAsync(inject([AmazonWebService, XHRBackend],
    (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {
      const mockResponse = 'No efs data';

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      component.updateStatus();

      expect(component.responseFromAWS).toEqual(mockResponse);
    })));

  it('should updateStatus from creating to available', fakeAsync(inject([AmazonWebService, XHRBackend],
    (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {
      const mockResponse = [
        {
          'OwnerId': '717002997396',
          'CreationToken': 'tokenstring',
          'FileSystemId': 'fs-92a25aeb',
          'CreationTime': '2018-03-18T17:39:40.000Z',
          'LifeCycleState': 'available',
          'Name': 'Test-rdc',
          'NumberOfMountTargets': 0,
          'SizeInBytes': {
            'Value': 6144,
            'Timestamp': null
          },
          'PerformanceMode': 'generalPurpose',
          'Encrypted': false
        }
      ];

      component.efsInstances.push({
        id: 'fs-92a25aeb',
        context: '',
        name: 'instance-test2',
        size: 1,
        status: 'creating',
        creationDate: '2017-03-18T17:40:10.346z',
        checked: false
      });

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      component.updateStatus();
      expect(component.efsInstances[0].status).toEqual('available');
    })));

  it('should not update status if Ids do not match', fakeAsync(inject([AmazonWebService, XHRBackend],
    (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {
      const mockResponse = [
        {
          'OwnerId': '717002997396',
          'CreationToken': 'tokenstring',
          'FileSystemId': 'fs-92a25aeb',
          'CreationTime': '2018-03-18T17:39:40.000Z',
          'LifeCycleState': 'available',
          'Name': 'Test-rdc',
          'NumberOfMountTargets': 0,
          'SizeInBytes': {
            'Value': 6144,
            'Timestamp': null
          },
          'PerformanceMode': 'generalPurpose',
          'Encrypted': false
        }
      ];

      component.efsInstances.push({
        id: 'not-same-id',
        context: '',
        name: 'instance-test2',
        size: 1,
        status: 'creating',
        creationDate: '2017-03-18T17:40:10.346z',
        checked: false
      });

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      component.updateStatus();
      expect(component.efsInstances[0].status).toEqual('creating');
    })));

  it('should not setup rds instances with no efs data', async(inject([AmazonWebService, XHRBackend],
    (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {

      const mockResponse = 'No efs data';

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      component.ngOnInit();

      expect(component.responseFromAWS).toEqual(mockResponse);
    })));

  it('should setup rds instances with efs data', async(inject([AmazonWebService, XHRBackend],
    (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {

      const mockResponse = [
        {
          'OwnerId': '717002997396',
          'CreationToken': 'tokenstring',
          'FileSystemId': 'fs-92a25aeb',
          'CreationTime': '2018-03-18T17:39:40.000Z',
          'LifeCycleState': 'available',
          'Name': 'Test-rdc',
          'NumberOfMountTargets': 0,
          'SizeInBytes': {
            'Value': 6144,
            'Timestamp': null
          },
          'PerformanceMode': 'generalPurpose',
          'Encrypted': false
        }
      ];

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      const setUpInstance = new Promise((resolve) => {
        resolve({
          id: 'my-id',
          context: '',
          name: 'instance-test',
          size: 1,
          status: 'available',
          creationDate: '2017-03-18T17:40:10.346z',
          checked: false
        });
      });

      setUpInstance.then((mockEfsInstance: EFSInstance) => {
        new Promise((resolve) => {
          component.ngOnInit();
        }).then(() => {
          expect(component.efsInstances[0]).toEqual(mockEfsInstance);
        });
      });
    })));

  it('should terminateInstances with instance not checked', () => {
    component.efsInstances.push({
      id: 'instance-test2',
      context: '',
      name: 'instance-test2',
      size: 1,
      status: 'available',
      creationDate: '2017-03-18T17:40:10.346z',
      checked: false
    });

    component.terminateInstances();

    expect(component.responseFromAWS).toEqual('No instances checked for termination');
  });

  it('should terminateInstances with instance checked',
    fakeAsync(inject([AmazonWebService, XHRBackend],
      (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {
        const mockResponse = 'fs-7339c10a terminated';

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        component.efsInstances.push({
          id: 'fs-7339c10a',
          context: '',
          name: 'fs-7339c10a',
          size: 1,
          status: 'available',
          creationDate: '2017-03-18T17:40:10.346z',
          checked: true
        });

        component.terminateInstances();

        expect(component.responseFromAWS).toEqual(mockResponse);
      })));


  it('should createInstance', fakeAsync(inject([AmazonWebService, XHRBackend],
    (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {
      const mockResponse = 'efs-instance-test created';

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      component.createInstance();

      expect(component.responseFromAWS).toEqual(mockResponse);
    })));
});
