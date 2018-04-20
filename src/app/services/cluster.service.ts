import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class ClusterService {

  constructor(private http: Http) {}

  addMonitor(id) {
    return this.http.get(`/api/cluster/monitor/add/${id}`).map(res => res.json());
  }

  removeMonitor(id) {
    return this.http.get(`/api/cluster/monitor/remove/${id}`).map(res => res.json());
  }

  getClusters() {
    return this.http.get(`/api/clusters`).map(res => res.json());
  }

  context(service: string, title: string, region: string) {
    return this.http.get(`/api/cluster?id=${title}&region=${region}`).map(res => res.json());
  }

  contextNames() {
    return this.http.get(`/api/cluster/names`).map(res => res.json());
  }

}
