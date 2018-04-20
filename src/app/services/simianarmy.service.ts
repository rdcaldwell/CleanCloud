import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class SimianArmyService {

  constructor(private http: Http) {}

  optOut(resourceId) {
    return this.http.post(`http://localhost:8080/simianarmy/api/v1/janitor`, {
      'eventType': 'OPTOUT',
      'resourceId': resourceId
    }).map(res => res.json());
  }

  optIn(resourceId) {
    return this.http.post(`http://localhost:8080/simianarmy/api/v1/janitor`, {
      'eventType': 'OPTIN',
      'resourceId': resourceId
    }).map(res => res.json());
  }

}
