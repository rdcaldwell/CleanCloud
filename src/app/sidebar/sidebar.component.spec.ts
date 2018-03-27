import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';
import {AuthenticationService} from '../services/authentication.service';
import {MatSidenavModule} from '@angular/material';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpModule} from '@angular/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {BrowserTestingModule} from '@angular/platform-browser/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarComponent ],
      imports: [ MatSidenavModule, RouterTestingModule, HttpModule, HttpClientTestingModule,
        BrowserAnimationsModule],
      providers: [ AuthenticationService ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TODO Sidebar covers up test spec
  xit('should create', () => {
    expect(component).toBeTruthy();
  });

});
