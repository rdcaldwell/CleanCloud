import {async, ComponentFixture, fakeAsync, inject, TestBed} from '@angular/core/testing';

import { JanitorComponent } from './janitor.component';
import {FormsModule} from '@angular/forms';
import {AmazonWebService} from '../services/amazonweb.service';
import {HttpModule, Response, ResponseOptions, XHRBackend} from '@angular/http';
import {MatDialog, MatDialogModule} from '@angular/material';
import {MockBackend} from '@angular/http/testing';
import {OnInit} from '@angular/core';

describe('JanitorComponent', () => {
  let component: JanitorComponent;
  let fixture: ComponentFixture<JanitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JanitorComponent ],
      imports: [ FormsModule, HttpModule ],
      providers: [{provide: MatDialog, useValue: {}}, AmazonWebService,
        { provide: XHRBackend, useClass: MockBackend }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JanitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Todo
  // dialog issue, dialog.open isn't a function, need to provide a stub
  // xit('should hav', fakeAsync(inject([AmazonWebService, XHRBackend],
  //   (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {
  //     const mockResponse = [
  //       {
  //         'id': '717002997396',
  //         'region': 'us-west-2',
  //         'defaultEmail': 'test@test.com',
  //         'summaryEmail': 'test2@test.com',
  //         'sourceEmail': 'test2@test.com',
  //         'isMonkeyTime': 'true',
  //         'port': 0,
  //         }
  //     ];
  //
  //     mockBackend.connections.subscribe((connection) => {
  //       connection.mockRespond(new Response(new ResponseOptions({
  //         body: JSON.stringify(mockResponse)
  //       })));
  //     });
  //
  //     component.createJanitor();
  //   })));


  it('should destroy janitor if janitor is checked',
    (inject([AmazonWebService, XHRBackend],
      (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {

        const mockResponse = 'destroyed';

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        component.janitors.push({
          'id': '717002997396',
          'region': 'us-west-2',
          'defaultEmail': 'test@test.com',
          'summaryEmail': 'test2@test.com',
          'sourceEmail': 'test2@test.com',
          'isMonkeyTime': 'true',
          'port': 0,
          'checked': true
        });

        const spy = spyOn(component, 'getJanitors');
        component.destroyJanitor();

        expect(spy).toHaveBeenCalled();
      })));

  it('should not destroy janitor if janitor is not checked',
    (inject([AmazonWebService, XHRBackend],
      (amazonWebService: AmazonWebService, mockBackend: MockBackend) => {

        const mockResponse = 'destroyed';

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });

        component.janitors.push({
          'id': '717002997396',
          'region': 'us-west-2',
          'defaultEmail': 'test@test.com',
          'summaryEmail': 'test2@test.com',
          'sourceEmail': 'test2@test.com',
          'isMonkeyTime': 'true',
          'port': 0,
          'checked': false
        });

        const spy = spyOn(component, 'getJanitors');
        component.destroyJanitor();

        expect(spy).toHaveBeenCalledTimes(0);
      })));
});
