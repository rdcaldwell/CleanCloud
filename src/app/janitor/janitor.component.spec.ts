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
  // dialog issue
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
});
