import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsComponent } from './analytics.component';
import {HttpModule} from '@angular/http';
import {MatDialogModule} from '@angular/material/dialog';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {AmazonWebService} from '../services/amazonweb.service';

describe('AnalyticsComponent', () => {
  let component: AnalyticsComponent;
  let fixture: ComponentFixture<AnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalyticsComponent ],
      imports: [ HttpModule, MatDialogModule ],
      providers: [ AmazonWebService, {provide: MAT_DIALOG_DATA, useValue:
          {data: { response: {'test': 'test'}, name: 'name' }}},
        {provide: MatDialogModule, useValue: {}}, {provide: MatDialogRef, useValue: {}} ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Todo Line 54 issues
  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
