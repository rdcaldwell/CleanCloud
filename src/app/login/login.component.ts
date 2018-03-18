import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../services/authentication.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials: TokenPayload = {
    username: '',
    password: ''
  };

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();

  incorrectPassword = false;
  userNotFound = false;

  constructor(private authenticationService: AuthenticationService,
              private router: Router) { }

  ngOnInit() { }

  login() {
    this.incorrectPassword = false;
    this.userNotFound = false;
    this.authenticationService.login(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/profile');
    }, (err) => {
      // Login validations
      if (err.error.message === 'User not found') {
        this.userNotFound = true;
      } else if (err.error.message === 'Password is wrong') {
        this.incorrectPassword = true;
      }
    });
  }
}
