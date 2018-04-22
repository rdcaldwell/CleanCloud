import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public usernameFound: boolean;
  public emailFound: boolean;
  public passwordCheck: boolean;
  public credentials: TokenPayload = {
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
  };

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  /**
   * Validates if username is already taken.
   */
  validateUsername() {
    if (this.credentials.username) {
      this.authenticationService.validate(this.credentials.username, 'username').subscribe(data => {
        this.usernameFound = data.found;
      });
    }
  }

  /**
   * Validates if email is already taken.
   */
  validateEmail() {
    if (this.credentials.email) {
      this.authenticationService.validate(this.credentials.email, 'email').subscribe(data => {
        this.emailFound = data.found;
      });
    }
  }
  /**
   * Registers new user.
   */
  register() {
    this.authenticationService.register(this.credentials).subscribe((data) => {
      alert(data);
      this.credentials.email = '';
      this.credentials.username = '';
      this.credentials.firstName = '';
      this.credentials.lastName = '';
      this.credentials.password = '';
    }, (err) => {
      console.error(err);
    });
  }
}
