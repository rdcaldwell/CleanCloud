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

  getInstances() {
    return this.http.get('/api/instances').map(res => res.json());
  }

  create() {
    return this.http.get('/api/create').map(res => res.json());
  }

  terminate(instanceId) {
    return this.http.get('/api/terminate/' + instanceId).map(res => res.json());
  }

  setActiveId(id: string) {
    this.activeId.next(id);
  }
}
