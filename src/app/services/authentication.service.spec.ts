import {TestBed, inject, ComponentFixture} from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {company} from 'aws-sdk/clients/importexport';
import {LoginComponent} from '../login/login.component';
import {Router} from '@angular/router';

describe('AuthenticationService', () => {
  let router: Router;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticationService],
      imports: [ HttpModule, HttpClientModule, RouterTestingModule.withRoutes([
        { path: 'login', redirectTo: '/'}
      ]) ]
    })
    router = TestBed.get(Router);
    router.initialNavigation();
  });

  afterEach( () => {
    localStorage.removeItem('janitor-token');
  });

  it('should be created', inject([AuthenticationService], (service: AuthenticationService) => {
    expect(service).toBeTruthy();
  }));

  it('canActivate should return false if not logged in',
    inject([AuthenticationService], (service: AuthenticationService) => {
      const returnVal = service.canActivate();
      expect(returnVal).toEqual(false);
    }));

  it('canActivate should return true if logged in',
    inject([AuthenticationService], (service: AuthenticationService) => {
      spyOn(service, 'isLoggedIn').and.returnValue(true);
      const returnval = service.canActivate();
      expect(returnval).toEqual(true);
    }));

  it('should return null if no token to get user',
    inject([AuthenticationService], (service: AuthenticationService) => {

      const returnval = service.getUser();
      expect(returnval).toBeNull();
    }));

  it('should return true if user is logged in',
    inject([AuthenticationService], (service: AuthenticationService) => {
      localStorage.setItem('janitor-token',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTdlNTIwNzdiZTc2ZT' +
        'ZmMDI2MGJkM2IiLCJlbWFpbCI6InJkY0BmaXNjaGVyaW50ZXJuYXRpb25hbC5jb20iLCJ1c2VyIjoiYWRt' +
        'aW4iLCJleHAiOjE1MjI2ODgwMTUsImlhdCI6MTUyMjA4MzIxNX0.Dccbi-3E4YRIDKFgpUFV1XRoebHurdpnizut-rxxZBc');

      const returnval = service.isLoggedIn();
      expect(returnval).toEqual(true);
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
  //     service.login();
  //     expect(spy).toHaveBeenCalled();
  //   }));
});
