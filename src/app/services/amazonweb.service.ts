import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class AmazonWebService {

  constructor(private http: Http) {}

  optOut(port, resourceId) {
    return this.http.post(`/simianarmy/api/v1/janitor`, {
      'eventType': 'OPTOUT',
      'resourceId': resourceId
    }).map(res => res.json());
  }

  optIn(port, resourceId) {
    return this.http.post(`/simianarmy/api/v1/janitor`, {
      'eventType': 'OPTIN',
      'resourceId': resourceId
    }).map(res => res.json());
  }

  unmarkCluster(name) {
    return this.http.get(`/api/job/cancel/${name}`).map(res => res.json());
  }

  getClusters() {
    return this.http.get(`/api/clusters`).map(res => res.json());
  }

  destroyCluster(name) {
    return this.http.get(`/api/jenkins/destroy/${name}`).map(res => res.json());
  }

  destroyJanitor(id) {
    return this.http.get(`/api/janitor/destroy/${id}`).map(res => res.json());
  }

  runJanitor(janitorConfig) {
    return this.http.post(`/api/janitor/run`, janitorConfig).map(res => res.json());
  }

  getJanitors() {
    return this.http.get(`/api/janitors`).map(res => res.json());
  }

  describe(service: string) {
    return this.http.get(`/api/${service}/describe`).map(res => res.json());
  }

  describeTags(service: string, context: string) {
    return this.http.get(`/api/${service}/describe/tags/${context}`).map(res => res.json());
  }

  create(service: string) {
    return this.http.get(`/api/${service}/create`).map(res => res.json());
  }

  terminateAWS(service: string, instanceId: string) {
    return this.http.get(`/api/${service}/terminate/${instanceId}`).map(res => res.json());
  }

  context(service: string, title: string) {
    return this.http.get(`/api/context/${title}`).map(res => res.json());
  }

  contextNames() {
    return this.http.get(`/api/context`).map(res => res.json());
  }

  analyze(instance) {
    return this.http.post(`/api/analyze/`, {
      launchTime: instance.creationDate,
      id: instance.id
    }).map(res => res.json());
  }

  getPrice(service, data) {
    return this.http.post(`/api/price/${service}`, data).map(res => res.json());
  }
}
