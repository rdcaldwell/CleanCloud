import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import { JanitorDialogComponent } from './janitordialog.component';
import {JanitorComponent} from '../janitor.component';
import {MomentModule} from 'angular2-moment';
import {AmazonWebService} from '../../services/amazonweb.service';
import {HttpModule, Response, ResponseOptions, XHRBackend} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material';
import {MockBackend} from '@angular/http/testing';

describe('JanitordialogComponent', () => {
  let component: JanitorDialogComponent;
  let fixture: ComponentFixture<JanitorDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JanitorDialogComponent, JanitorComponent ],
      imports: [ MomentModule, HttpModule, FormsModule, MatDialogModule ],
      providers: [ AmazonWebService, {provide: MAT_DIALOG_DATA, useValue: {
          'test': 'test'
        }},
        {provide: MatDialogModule, useValue: {}}, {provide: MatDialogRef, useValue: {}} ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JanitorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
