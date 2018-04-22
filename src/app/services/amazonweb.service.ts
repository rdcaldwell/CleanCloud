import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';
import 'rxjs/add/operator/map';

@Injectable()
export class AmazonWebService {

  constructor(private http: Http) { }

  /**
   * API call for all resource data of the service.
   * @param {string} service - The AWS resource service.
   */
  describe(service: string) {
    return this.http.get(`/api/${service}/describe`).map(res => res.json());
  }

  /**
   * API call for destroying resource in AWS.
   * @param {string} service - The AWS resource service.
   * @param {string} instanceId - The instance id.
   * @param {string} region - The region of the instance.
   */
  destroy(service: string, instanceId: string, region: string) {
    return this.http.get(`/api/${service}/terminate?id=${instanceId}&region=${region}`).map(res => res.json());
  }

  /**
   * API call for getting EC2 instance CloudWatch CPU Utilization metrics.
   * @param {object} instance - Instance data.
   */
  analyze(instance: any) {
    return this.http.get(`/api/analyze?id=${instance.id}&region=${instance.zone}`).map(res => res.json());
  }

  /**
   * API call for getting price of AWS resource.
   * @param {string} service - The AWS resource service.
   * @param {string} data - The instance data.
   */
  getPrice(service: string, data: any) {
    return this.http.post(`/api/price/${service}`, data).map(res => res.json());
  }

  /**
   * Gets the value of the a tag key.
   * @param {array} tags - The tags of the instance.
   * @param {string} key - The tag being searched.
   * @returns {string} - Value of the tag key.
   */
  getTag(tags: any, key: string): string {
    for (const tag of tags) {
      if (tag.Key === key) {
        return tag.Value;
      }
    }
  }

  /**
   * Gets the total hours the instance has been running.
   * @param {string} startTime - The start time of the instance.
   * @returns {string} - Amount of hours the instance has been running.
   */
  getRunningHours(startTime): number {
    const hours = moment.duration(moment().diff(startTime)).asHours();
    return Math.round(hours * 100) / 100;
  }
}
