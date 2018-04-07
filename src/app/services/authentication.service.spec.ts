import { TestBed, inject, ComponentFixture } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { company } from 'aws-sdk/clients/importexport';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import Spy = jasmine.Spy;

describe('AuthenticationService', () => {
  let router: Router;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticationService],
      imports: [HttpModule, HttpClientModule, RouterTestingModule.withRoutes([
        { path: 'login', redirectTo: '/' }
      ])]
    });
    router = TestBed.get(Router);
    router.initialNavigation();
  });

  afterEach(() => {
    localStorage.removeItem('janitor-token');
  });

  it('should be created', inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
  }));

  it('canActivate should return false if not logged in',
    inject([AuthenticationService], (service: AuthenticationService) => {
      const returnVal = service.canActivate();
      expect(returnVal).toBe(false);
    }));

  it('canActivate should return true if logged in',
    inject([AuthenticationService], (service: AuthenticationService) => {
      spyOn(service, 'isLoggedIn').and.returnValue(true);
      const returnVal = service.canActivate();
      expect(returnVal).toBe(true);
    }));

  it('should return null if no token to get user',
    inject([AuthenticationService], (service: AuthenticationService) => {
      const returnval = service.getUser();
      expect(returnval).toBeNull();
    }));

  // Todo, need to make a token with updating expiration
  it('should return true if user is logged in',
    inject([AuthenticationService], (service: AuthenticationService) => {
      jasmine.clock().mockDate(new Date('April 6, 2018'));
      localStorage.setItem('janitor-token',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTdlNTIwNzdiZTc2ZTZmMD' +
        'I2MGJkM2IiLCJlbWFpbCI6ImFkbWluQGZpc2NoZXJpbnRlcm5hdGlvbmFsLmNvbSIsInVzZX' +
        'IiOiJhZG1pbiIsImV4cCI6MTUyMzY2NTY5NiwiaWF0IjoxNTIzMDYwODk2fQ.kBJL7-y-_-8' +
        'n_WENX5hBluQ46hmwIYXc-K37ZNS8lN0');

      // let token = localStorage.getItem('janitor-token');
      // token
      const returnval = service.isLoggedIn();
      expect(returnval).toBe(true);
    }));

  it('should remove janitor token when logging out',
    inject([AuthenticationService], (service: AuthenticationService) => {

      const spy = spyOn(localStorage, 'removeItem');
      service.logout();
      expect(spy).toHaveBeenCalled();
    }));

  it('should redirect to login after logout',
    inject([AuthenticationService], (service: AuthenticationService) => {

      const spy = spyOn(router, 'navigateByUrl');
      service.logout();
      expect(spy).toHaveBeenCalled();
    }));

  // it('should login',
  //   inject([AuthenticationService], (service: AuthenticationService) => {
  //
  //     const spy = spyOn(router, 'navigateByUrl');
  //
  //     const token = {
  //       email: 'test@test.com',
  //       password: 'pq',
  //
  //     }
  //
  //     service.login(token);
  //     expect(spy).toHaveBeenCalled();
  //   }));
});
