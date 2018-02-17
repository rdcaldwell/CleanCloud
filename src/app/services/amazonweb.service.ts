import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class AmazonWebService {

  private activeId = new BehaviorSubject<string>('');
  id = this.activeId.asObservable();

  constructor(private http: Http) {}

  describe(service: string) {
    return this.http.get(`/api/describe/${service}`).map(res => res.json());
  }

  describeTags(service: string, context: string) {
    return this.http.get(`/api/describe/tags/${service}/${context}`).map(res => res.json());
  }

  create(service: string) {
    return this.http.get(`/api/create/${service}`).map(res => res.json());
  }

  terminate(service: string, instanceId: string) {
    return this.http.get(`/api/terminate/${service}/${instanceId}`).map(res => res.json());
  }

  context(service: string, title: string) {
    return this.http.get(`/api/context/${service}/${title}`).map(res => res.json());
  }

  contextNames() {
    return this.http.get(`/api/context/names`).map(res => res.json());
  }

  setActiveId(id: string) {
    this.activeId.next(id);
    console.log('active id: ' + this.activeId.getValue());
  }
}
