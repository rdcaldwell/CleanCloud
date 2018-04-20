import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class AmazonWebService {

  constructor(private http: Http) { }

  describe(service: string) {
    return this.http.get(`/api/${service}/describe`).map(res => res.json());
  }

  destroy(service: string, instanceId: string, region: string) {
    return this.http.get(`/api/${service}/terminate?id=${instanceId}&region=${region}`).map(res => res.json());
  }

  analyze(instance) {
    return this.http.get(`/api/analyze?id=${instance.id}&region=${instance.zone}`).map(res => res.json());
  }

  getPrice(service, data) {
    return this.http.post(`/api/price/${service}`, data).map(res => res.json());
  }
}
