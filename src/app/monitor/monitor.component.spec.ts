import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import { MonitorComponent } from './monitor.component';
import {FormsModule} from '@angular/forms';
import {MomentModule} from 'angular2-moment';
import {AmazonWebService} from '../services/amazonweb.service';
import {HttpModule, Response, ResponseOptions, XHRBackend} from '@angular/http';
import {MockBackend} from '@angular/http/testing';

describe('MonitorComponent', () => {
  let component: MonitorComponent;
  let fixture: ComponentFixture<MonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorComponent ],
      imports: [ MomentModule, HttpModule ],
      providers: [ AmazonWebService, MockBackend,
        { provide: XHRBackend, useClass: MockBackend } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create cluster data on init', (inject([XHRBackend], (mockBackend: MockBackend) => {
    const mockResponse = [{
      'context': 'testContext',
      'resourceIds': '1',
      'startedBy': 'John',
      'region': 'us-west-2',
      'destroyed': false,
      'destructionDate': '2019-03-18T17:39:40.000Z',
      'marked': true,
      'monitored': true
    }];

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockResponse)
      })));
    });

    component.ngOnInit();

    expect(component.clusters).toEqual(mockResponse);
  })));

  it('should unmark clusters', (inject([XHRBackend], (mockBackend: MockBackend) => {
    const mockResponse = [{
      'context': 'testContext',
      'resourceIds': '1',
      'startedBy': 'John',
      'region': 'us-west-2',
      'destroyed': false,
      'destructionDate': '2019-03-18T17:39:40.000Z',
      'marked': true,
      'monitored': true
    }];

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockResponse)
      })));
    });

    component.ngOnInit();

    component.unmark(component.clusters[0]);

    expect(component.clusters[0].marked).toEqual(false);
  })));


  it('should optIn clusters', (inject([XHRBackend], (mockBackend: MockBackend) => {
    const mockResponse = [{
      'context': 'testContext',
      'resourceIds': '1',
      'startedBy': 'John',
      'region': 'us-west-2',
      'destroyed': false,
      'destructionDate': '2019-03-18T17:39:40.000Z',
      'marked': true,
      'monitored': null
    }];

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockResponse)
      })));
    });

    component.ngOnInit();

    component.optIn(component.clusters[0]);

    expect(component.clusters[0].monitored).toEqual(true);
  })));

  it('should optOut clusters', (inject([XHRBackend], (mockBackend: MockBackend) => {
    const mockResponse = [{
      'context': 'testContext',
      'resourceIds': '1',
      'startedBy': 'John',
      'region': 'us-west-2',
      'destroyed': false,
      'destructionDate': '2019-03-18T17:39:40.000Z',
      'marked': true,
      'monitored': null
    }];

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockResponse)
      })));
    });

    component.ngOnInit();

    component.optOut(component.clusters[0]);

    expect(component.clusters[0].monitored).toEqual(false);
  })));

  it('should return true if a cluster is marked',
    (inject([XHRBackend], (mockBackend: MockBackend) => {
    const mockResponse = [{
      'context': 'testContext',
      'resourceIds': '1',
      'startedBy': 'John',
      'region': 'us-west-2',
      'destroyed': false,
      'destructionDate': '2019-03-18T17:39:40.000Z',
      'marked': true,
      'monitored': null
    }];

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockResponse)
      })));
    });

    component.ngOnInit();
    const returnVal = component.isAnyClusterMarked();

    expect(returnVal).toEqual(true);
  })));

  it('should return false if a cluster is not marked',
    (inject([XHRBackend], (mockBackend: MockBackend) => {
      const mockResponse = [{
        'context': 'testContext',
        'resourceIds': '1',
        'startedBy': 'John',
        'region': 'us-west-2',
        'destroyed': false,
        'destructionDate': '2019-03-18T17:39:40.000Z',
        'marked': false,
        'monitored': null
      }];

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      component.ngOnInit();
      const returnVal = component.isAnyClusterMarked();

      expect(returnVal).toEqual(false);
    })));

  it('should destroy selected cluster',
    (inject([XHRBackend], (mockBackend: MockBackend) => {
      const mockResponse = [{
        'context': 'testContext',
        'resourceIds': '1',
        'startedBy': 'John',
        'region': 'us-west-2',
        'destroyed': false,
        'destructionDate': '2019-03-18T17:39:40.000Z',
        'marked': false,
        'monitored': null
      }];

      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });

      component.ngOnInit();
      component.destroy(component.clusters[0]);

      expect(component.clusters[0].destroyed).toEqual(true);
    })));
});
