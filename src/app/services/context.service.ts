import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()
export class ContextService {

  constructor(private http: Http) { }

  context(service: string, title: string) {
    return this.http.get(`/api/context/${service}/${title}`).map(res => res.json());
  }

  contextNames(service:string) {
    return this.http.get(`/api/context/names/${service}`).map(res => res.json());    
  }

}
