import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class AmazonWebService {

  constructor(private http: Http) {}

  runJanitor(janitorConfig) {
    return this.http.post(`/api/janitor/run`, janitorConfig).map(res => res.json());
  }

  getJanitors() {
    return this.http.get(`/api/janitors`).map(res => res.json());
  }

  destroyJanitor(id) {
    return this.http.get(`/api/janitor/destroy/${id}`).map(res => res.json());
  }

  describe(service: string) {
    return this.http.get(`/api/describe/${service}`).map(res => res.json());
  }

  describeTags(service: string, context: string) {
    return this.http.get(`/api/describe/tags/${service}/${context}`).map(res => res.json());
  }

  create(service: string) {
    return this.http.get(`/api/create/${service}`).map(res => res.json());
  }

  terminateAWS(service: string, instanceId: string) {
    return this.http.get(`/api/terminate/${service}/${instanceId}`).map(res => res.json());
  }

  terminateJenkins() {
    return this.http.get(`/api/jenkins/destroy`).map(res => res.json());
  }

  context(service: string, title: string) {
    return this.http.get(`/api/context/${service}/${title}`).map(res => res.json());
  }

  contextNames() {
    return this.http.get(`/api/context/names`).map(res => res.json());
  }

  cost(id) {
    return this.http.get(`/api/cost/${id}`).map(res => res.json());
  }
}
