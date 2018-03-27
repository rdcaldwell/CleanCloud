import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  response: any;
  credentials: TokenPayload = {
    username: '',
    password: ''
  };

  incorrectPassword = false;
  userNotFound = false;

  constructor(private authenticationService: AuthenticationService,
              private router: Router) { }

  ngOnInit() { }

  login() {
    this.incorrectPassword = false;
    this.userNotFound = false;
    this.authenticationService.login(this.credentials).subscribe(data => {
      this.response = data;
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
