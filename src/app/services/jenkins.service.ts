import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class JenkinsService {

  constructor(private http: Http) {}

  destroy(name) {
    return this.http.get(`/api/jenkins/destroy/${name}`).map(res => res.json());
  }

}
