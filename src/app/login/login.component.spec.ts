import {async, ComponentFixture, fakeAsync, inject, TestBed} from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {FormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material';
import {HttpModule, Response, ResponseOptions, ResponseType, XHRBackend} from '@angular/http';
import {MomentModule} from 'angular2-moment';
import {AuthenticationService} from '../services/authentication.service';
import {HttpClientModule, HttpErrorResponse} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {MockBackend} from '@angular/http/testing';
import {AmazonWebService} from '../services/amazonweb.service';
import {Observable} from 'rxjs/Observable';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ MomentModule, HttpModule, HttpClientModule,
        RouterTestingModule.withRoutes([
          { path: 'profile', redirectTo: '/'}
        ]), FormsModule],
      providers: [ AuthenticationService,
        { provide: XHRBackend, useClass: MockBackend }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Todo get working tests for input validation
  // it('should not find the username', () => {
  //   component.credentials.password = 'password';
  //   component.credentials.username = 'a';
  //
  //   component.login();
  //
  //   expect(component.userNotFound).toBe(true);
  // });

  // it('should not validate the password',
  //   fakeAsync(inject([AuthenticationService, XHRBackend],
  //     (authenticationService: AuthenticationService, mockBackend: MockBackend) => {
  //
  //   component.credentials.password = 'passw';
  //   component.credentials.username = 'admin';
  //
  //   spyOn(authenticationService, 'login').and
  //     .returnValue(
  //       Observable.throw(
  //         new HttpErrorResponse({
  //           error: {
  //             message: 'Wrong',
  //             localizedKey: 'someKey'
  //           },
  //           status: 401
  //         })
  //       )
  //     );
  //
  //   component.login();
  //   expect(component.incorrectPassword).toBe(true);
  // })));

  // it('should not find user', (inject([AuthenticationService, XHRBackend],
  //   (authenticationService: AuthenticationService, mockBackend: MockBackend) => {
  //       component.credentials.password = 'test@test.com';
  //       component.credentials.username = 'admin';
  //
  //
  //       mockBackend.connections.subscribe((connection) => {
  //         connection.mockError(new Error('User not found'));
  //       });
  //
  //       component.login();
  //   })));
});
