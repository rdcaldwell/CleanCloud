import { FormsModule } from '@angular/forms';
import { TestBed, ComponentFixture, async, inject, tick, fakeAsync } from '@angular/core/testing';
import { HttpModule, Response, ResponseOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { DashboardComponent } from './dashboard.component';
import { Ec2Component } from '../ec2/ec2.component';
import { EfsComponent } from '../efs/efs.component';
import { RdsComponent } from '../rds/rds.component';
import { MomentModule } from 'angular2-moment';
import { MatDialogModule } from '@angular/material';

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
});
