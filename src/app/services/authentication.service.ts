import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Router, CanActivate } from '@angular/router';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

export interface User {
  _id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email?: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

@Injectable()
export class AuthenticationService {

  private token: string;

  constructor(private httpClient: HttpClient, private http: Http, private router: Router) { }

  canActivate() {
    if (!this.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }

  // Validate form fields
  validate(field, type) {
    return this.http.get(`/api/auth/${type}/${field}`).map(res => res.json());
  }

  private saveToken(token: string): void {
    localStorage.setItem('janitor-token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('janitor-token');
    }
    return this.token;
  }

  public getUser(): User {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUser();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  private getRequest() {
    const base = this.httpClient.get(`/api/auth/profile`, { headers: { Authorization: `Bearer ${this.getToken()}` } });

    return this.request(base);
  }

  private postRequest(type, user?: TokenPayload): Observable<any> {
    const base = this.httpClient.post(`/api/auth/${type}`, user);

    return this.request(base);
  }

  private request(base) {
    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );

    return request;
  }

  public register(user: TokenPayload): Observable<any> {
    return this.postRequest('register', user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.postRequest('login', user);
  }

  public profile(): Observable<any> {
    return this.getRequest();
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('janitor-token');
    this.router.navigateByUrl('/login');
  }
}
