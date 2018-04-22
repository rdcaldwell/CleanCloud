import {async, ComponentFixture, fakeAsync, inject, TestBed} from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import {FormsModule} from '@angular/forms';
import {HttpModule, XHRBackend} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {MomentModule} from 'angular2-moment';
import {AuthenticationService, TokenPayload} from '../services/authentication.service';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import 'rxjs/add/observable/throw';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [ FormsModule, HttpModule, HttpClientModule, MomentModule, RouterTestingModule ],
      providers: [ AuthenticationService,
        { provide: XHRBackend, useClass: MockBackend }
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create register component', () => {
    expect(component).toBeTruthy();
  });

  it('should test register method', fakeAsync(inject([AuthenticationService],
    (authenticationService: AuthenticationService) => {
    component.credentials = {
      email: 'email',
      username: 'uname',
      password: 'pword',
      firstName: 'fname',
      lastName: 'lname',
    };
    const spy = spyOn(authenticationService, 'register').and.returnValue({ subscribe: () => {} });
    component.register();
    expect(spy).toHaveBeenCalled();
  })));

  it('should validate Email', (inject([AuthenticationService],
    (authenticationService: AuthenticationService) => {
    component.credentials.email = 'testemail@email.com';
    spyOn(authenticationService, 'validate').and.returnValue({ subscribe:
        (data) => {component.emailFound = true; } });

    component.validateEmail();
    expect(component.emailFound).toEqual(true);
  })));

  it('should not validate Email', (inject([AuthenticationService],
    (authenticationService: AuthenticationService) => {
      spyOn(authenticationService, 'validate').and.returnValue({ subscribe:
          (data) => {component.emailFound = true; } });

      component.validateEmail();
      expect(component.emailFound).toEqual(undefined);
    })));

  it('should validate username', (inject([AuthenticationService],
    (authenticationService: AuthenticationService) => {
      component.credentials.username = 'test';
      spyOn(authenticationService, 'validate').and.returnValue({ subscribe:
          (data) => {component.usernameFound = true; } });

      component.validateUsername();
      expect(component.usernameFound).toEqual(true);
    })));

  it('should not validate username', (inject([AuthenticationService],
    (authenticationService: AuthenticationService) => {
      spyOn(authenticationService, 'validate').and.returnValue({ subscribe:
          (data) => {component.usernameFound = true; } });

      component.validateUsername();
      expect(component.usernameFound).toEqual(undefined);
    })));
});
