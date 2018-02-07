import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AnalyticsService {

  constructor(private http: Http) { }

  analyze(id: string) {
    return this.http.get('/api/analyze/' + id).map(res => res.json());
  }
}
