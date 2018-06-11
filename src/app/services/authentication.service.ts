import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Router, CanActivate } from '@angular/router';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

export interface User {
  uid: string;
  exp: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  password: string;
  username: string;
}

@Injectable()
export class AuthenticationService {

  private token: string;

  constructor(private httpClient: HttpClient, private http: Http, private router: Router) { }

  /**
   * Activates route if user is logged in.
   */
  canActivate() {
    if (!this.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }

  /**
   * Saves authentication token to local storage.
   * @param {string} token - The authentication token.
   */
  private saveToken(token: string): void {
    localStorage.setItem('cc-token', token);
    this.token = token;
  }

  /**
   * Gets authentication token.
   * @returns {string} - The authentication token.
   */
  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('cc-token');
    }
    return this.token;
  }

  /**
   * Gets the current user.
   * @returns {User} - Data of current user.
   */
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

  /**
   * Checks if user is logged in.
   * @returns {boolean} - Logged in state.
   */
  public isLoggedIn(): boolean {
    const user = this.getUser();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  /**
   * Sends GET request to API.
   */
  private getRequest() {
    const base = this.httpClient.get(`/api/auth/profile`, { headers: { Authorization: `Bearer ${this.getToken()}` } });

    return this.request(base);
  }

  /**
   * Sends POST request to API.
   * @param type - Registration or login function.
   * @param user - The users data.
   */
  private postRequest(type, user?: TokenPayload): Observable<any> {
    const base = this.httpClient.post(`/api/auth/${type}`, user);

    return this.request(base);
  }

  /**
   * Makes rewust to API.
   * @param base - URL path.
   */
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

  /**
   * API call for registering new user.
   * @param user - User registration data.
   */
  public register(user: TokenPayload): Observable<any> {
    return this.postRequest('register', user);
  }

  /**
   * API call for loggin in user.
   * @param user - User login info.
   */
  public login(user: TokenPayload): Observable<any> {
    return this.postRequest('login', user);
  }

  /**
   * API call for reading profile.
   */
  public profile(): Observable<any> {
    return this.getRequest();
  }

  /**
   * Logs user out and destroys authentication token.
   */
  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('cc-token');
    this.router.navigateByUrl('/login');
  }
}
