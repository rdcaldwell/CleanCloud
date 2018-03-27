import { FormsModule } from '@angular/forms';
import {TestBed, ComponentFixture, async, inject, tick, fakeAsync} from '@angular/core/testing';
import { HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { DashboardComponent } from './dashboard.component';
import { Ec2Component } from '../ec2/ec2.component';
import { EfsComponent } from '../efs/efs.component';
import { RdsComponent } from '../rds/rds.component';
import { ClusterComponent } from '../cluster/cluster.component';
import { MomentModule } from 'angular2-moment';
import {MatDialogModule} from '@angular/material';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpModule,
        MomentModule,
        MatDialogModule
      ],
      declarations: [
        DashboardComponent,
        ClusterComponent,
        Ec2Component,
        EfsComponent,
        RdsComponent
      ],
      providers: [
        MockBackend,
        { provide: XHRBackend, useClass: MockBackend }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get context names', fakeAsync(inject([XHRBackend], (mockBackend: MockBackend) => {
    const mockResponse = [
      {
        '_id': '5aa59136ae0df1dbc214c7bd',
        'region': 'us-west-2',
        'defaultEmail': 'cloudianapp@gmail.com',
        'summaryEmail': 'cloudianapp@gmail.com',
        'sourceEmail': 'rdcaldwell5705@eagle.fgcu.edu',
        'isMonkeyTime': true,
        'port': 3333,
        '__v': 0
      },
      {
        '_id': '5aa591a8ae0df1dbc214c7be',
        'region': 'us-east-1',
        'defaultEmail': 'cloudianapp@gmail.com',
        'summaryEmail': 'cloudianapp@gmail.com',
        'sourceEmail': 'rdcaldwell5705@eagle.fgcu.edu',
        'isMonkeyTime': true,
        'port': 4444,
        '__v': 0
      }
    ];

    mockBackend.connections.subscribe((connection) => {
      connection.mockRespond(new Response(new ResponseOptions({
        body: JSON.stringify(mockResponse)
      })));
    });

    component.getContextNames();

    expect(component.context).toEqual(mockResponse);
  })));

  // TODO get response
  // it('should get context names', fakeAsync(inject([XHRBackend], (mockBackend: MockBackend) => {
  //   const mockResponse = { 'Datapoints': [
  //       {
  //         '_id': '5aa59136ae0df1dbc214c7bd',
  //         'region': 'us-west-2',
  //         'defaultEmail': 'cloudianapp@gmail.com',
  //         'summaryEmail': 'cloudianapp@gmail.com',
  //         'sourceEmail': 'rdcaldwell5705@eagle.fgcu.edu',
  //         'isMonkeyTime': true,
  //         'port': 3333,
  //         '__v': 0
  //       },
  //       {
  //         '_id': '5aa591a8ae0df1dbc214c7be',
  //         'region': 'us-east-1',
  //         'defaultEmail': 'cloudianapp@gmail.com',
  //         'summaryEmail': 'cloudianapp@gmail.com',
  //         'sourceEmail': 'rdcaldwell5705@eagle.fgcu.edu',
  //         'isMonkeyTime': true,
  //         'port': 4444,
  //         '__v': 0
  //       }
  //     ]};
  //
  //   mockBackend.connections.subscribe((connection) => {
  //     connection.mockRespond(new Response(new ResponseOptions({
  //       body: JSON.stringify(mockResponse)
  //     })));
  //   });
  //
  //   component.analyzeInstance('5aa59136ae0df1dbc214c7bd');
  //
  //   expect(component.context).toEqual(mockResponse);
  // })));
});
