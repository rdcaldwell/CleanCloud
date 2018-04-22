import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class JanitorService {

  constructor(private http: Http) { }

  /**
   * API call for destroying janitor instance.
   * @param {string} id - The janitor id.
   */
  destroyJanitor(id: string) {
    return this.http.get(`/api/janitor/destroy/${id}`).map(res => res.json());
  }

  /**
   * API call for running janitor instance.
   * @param {any} janitorConfig - The configuration data of the janitor.
   */
  runJanitor(janitorConfig: any) {
    return this.http.post(`/api/janitor/run`, janitorConfig).map(res => res.json());
  }

  /**
   * API call for getting all janitors.
   */
  getJanitors() {
    return this.http.get(`/api/janitors`).map(res => res.json());
  }

  /**
   * API call for checking janitor status.
   */
  isJanitorRunning() {
    return this.http.get(`/api/janitor/running`).map(res => res.json());
  }

}
