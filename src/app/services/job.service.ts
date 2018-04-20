import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class JobService {

  constructor(private http: Http) {}

  cancelJob(name) {
    return this.http.get(`/api/job/cancel/${name}`).map(res => res.json());
  }

}
