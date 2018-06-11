import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public invalidCredentials = false;
  public credentials: TokenPayload = {
    username: '',
    password: ''
  };

  constructor(private authenticationService: AuthenticationService,
    private router: Router) { }

  /**
   * Login in user.
   */
  login() {
    this.authenticationService.login(this.credentials).subscribe(data => {
      this.router.navigateByUrl('/instances');
    }, (err) => {
      this.invalidCredentials = true;
    });
  }
}
