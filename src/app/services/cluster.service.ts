import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class ClusterService {

  constructor(private http: Http) { }

  /**
   * API call for adding monitor to cluster.
   * @param {string} id - The cluster id.
   */
  addMonitor(id: string) {
    return this.http.get(`/api/janitor/monitor/add/${id}`).map(res => res.json());
  }

  /**
   * API call for removing monitor from cluster.
   * @param {string} id - The cluster id.
   */
  removeMonitor(id: string) {
    return this.http.get(`/api/janitor/monitor/remove/${id}`).map(res => res.json());
  }

  /**
   * API call for getting all clusters.
   */
  getClusters() {
    return this.http.get(`/api/clusters`).map(res => res.json());
  }

  /**
   * API call for getting cluster data by name.
   * @param {string} title - The name of the cluster.
   * @param {string} region - The region of the cluster.
   */
  context(title: string, region: string) {
    return this.http.get(`/api/cluster?id=${title}&region=${region}`).map(res => res.json());
  }

  /**
   * API call for getting all cluster names.
   */
  contextNames() {
    return this.http.get(`/api/cluster/names`).map(res => res.json());
  }

}
