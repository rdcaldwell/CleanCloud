import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class JenkinsService {

  constructor(private http: Http) {}

  /**
   * API call for destroying cluster using Jenkins pipeline.
   * @param {string} name - The name of the cluster.
   */
  destroy(name: string) {
    return this.http.get(`/api/jenkins/destroy/${name}`).map(res => res.json());
  }

}
