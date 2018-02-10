import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class InstancesService {

  private activeId = new BehaviorSubject<string>("");
  id = this.activeId.asObservable();

  constructor(private http: Http) {
  }

  getInstances(service: string) {
    return this.http.get(`/api/describe/${service}`).map(res => res.json());
  }

  create(service) {
    return this.http.get(`/api/create/${service}`).map(res => res.json());
  }

  terminate(service, instanceId) {
    return this.http.get(`/api/terminate/${service}/${instanceId}`).map(res => res.json());
  }

  setActiveId(id: string) {
    this.activeId.next(id);
  }
}
