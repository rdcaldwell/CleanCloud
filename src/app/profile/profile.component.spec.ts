import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import {FormsModule} from '@angular/forms';
import {MomentModule} from 'angular2-moment';
import {AuthenticationService} from '../services/authentication.service';
import {HttpModule} from '@angular/http';
import {RegisterComponent} from '../register/register.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileComponent, RegisterComponent ],
      imports: [ FormsModule, HttpModule, HttpClientTestingModule, RouterTestingModule ],
      providers: [ AuthenticationService ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
