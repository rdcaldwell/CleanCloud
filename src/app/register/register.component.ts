import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  credentials: TokenPayload = {
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
  };

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  register() {
    this.authenticationService.register(this.credentials).subscribe(() => {
    }, (err) => {
      console.error(err);
    });
  }
}
