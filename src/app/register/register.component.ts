import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  credentials: TokenPayload = {
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
  };

  usernameFound: boolean;
  emailFound: boolean;
  passwordCheck: boolean;

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  // Validate username
  validateUsername() {
    // If entered username is not blank
    if (this.credentials.username) {
      // Validate if username is taken in api
      this.authenticationService.validate(this.credentials.username, 'username').subscribe(data => {
        this.usernameFound = data.found;
      });
    }
  }

  // Validate email
  validateEmail() {
    // If entered email is not blank
    if (this.credentials.email) {
      // Validate if email is taken in api
      this.authenticationService.validate(this.credentials.email, 'email').subscribe(data => {
        this.emailFound = data.found;
      });
    }
  }

  register() {
    this.authenticationService.register(this.credentials).subscribe(() => {
    }, (err) => {
      console.error(err);
    });
  }
}
