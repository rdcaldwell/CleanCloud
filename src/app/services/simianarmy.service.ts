import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class SimianArmyService {

  constructor(private http: Http) {}

  /**
   * Simian Army REST API call for opting instance out of monitoring.
   * @param {string} resourceId - The id of the resource.
   */
  optOut(resourceId: string) {
    return this.http.post(`http://localhost:8080/simianarmy/api/v1/janitor`, {
      'eventType': 'OPTOUT',
      'resourceId': resourceId
    }).map(res => res.json());
  }

  /**
   * Simian Army REST API call for opting instance into monitoring.
   * @param {string} resourceId - The id of the resource.
   */
  optIn(resourceId: string) {
    return this.http.post(`http://localhost:8080/simianarmy/api/v1/janitor`, {
      'eventType': 'OPTIN',
      'resourceId': resourceId
    }).map(res => res.json());
  }

}
