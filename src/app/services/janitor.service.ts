import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class JanitorService {

  constructor(private http: Http) {}

  destroyJanitor(id) {
    return this.http.get(`/api/janitor/destroy/${id}`).map(res => res.json());
  }

  runJanitor(janitorConfig) {
    return this.http.post(`/api/janitor/run`, janitorConfig).map(res => res.json());
  }

  getJanitors() {
    return this.http.get(`/api/janitors`).map(res => res.json());
  }

  isJanitorRunning() {
    return this.http.get(`/api/janitor/running`).map(res => res.json());
  }

}
