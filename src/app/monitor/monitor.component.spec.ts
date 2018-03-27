import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorComponent } from './monitor.component';
import {FormsModule} from '@angular/forms';
import {MomentModule} from 'angular2-moment';
import {AmazonWebService} from '../services/amazonweb.service';
import {HttpModule} from '@angular/http';

describe('MonitorComponent', () => {
  let component: MonitorComponent;
  let fixture: ComponentFixture<MonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitorComponent ],
      imports: [ MomentModule, HttpModule ],
      providers: [ AmazonWebService ]
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
});
