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

  // Header errors thrown
  // it('should test register method', () => {
  //   component.credentials = {
  //     email: 'email',
  //     username: 'uname',
  //     password: 'pword',
  //     firstName: 'fname',
  //     lastName: 'lname',
  //   };
  //   expect(component.credentials.email).toBe('email');
  //   component.register();
  // });

  // it('should catch error in register method', fakeAsync(inject([AuthenticationService],
  //   (authenticationService: AuthenticationService) => {
  //   //spyOn(authenticationService, 'register').and.returnValue(Observable.throw({status: 404}));
  //   //component.register();
  // })));
});
