import { Component, OnInit } from '@angular/core';
import { AmazonWebService } from '../services/amazonweb.service';
import * as moment from 'moment';

@Component({
  selector: 'app-rds',
  templateUrl: './rds.component.html',
  styleUrls: ['./rds.component.css']
})
export class RdsComponent implements OnInit {
  responseFromAWS: any;
  public rdsInstances: Array<RDSInstance> = [];

  constructor(private amazonWebService: AmazonWebService) { }

  ngOnInit() {
    this.amazonWebService.describe('rds').subscribe(data => {
      if (data !== 'No rds data') {
        for (const instance of data) {
          const getRunningHours = new Promise((resolve, reject) => {
            resolve(this.getRunningHours(instance.InstanceCreateTime));
          });
          getRunningHours.then((hours: number) => {
            const getTotalCost = new Promise((resolve, reject) => {
              resolve(this.getCost(hours, instance));
            });
            getTotalCost.then((price: number) => {
              this.rdsInstances.push({
                id: instance.DBInstanceIdentifier,
                context: '',
                name: instance.DBName,
                type: instance.DBInstanceClass,
                engine: instance.Engine,
                zone: instance.AvailabilityZone,
                status: instance.DBInstanceStatus,
                creationDate: instance.InstanceCreateTime,
                runningHours: hours,
                cost: price,
                checked: false
              });
            });
          });
        }
        setInterval(() => {
          this.updateStatus();
        }, 5000);
      } else {
        this.responseFromAWS = data;
      }
    });
  }

  updateStatus() {
    this.amazonWebService.describe('rds').subscribe(data => {
      if (data !== 'No rds data') {
        for (const instance of data) {
          for (const rdsInstance of this.rdsInstances) {
            if (rdsInstance.id === instance.DBInstanceIdentifier) {
              rdsInstance.status = instance.DBInstanceStatus;
            }
          }
        }
      } else {
        this.responseFromAWS = data;
      }
    });
  }

  createInstance() {
    this.amazonWebService.create('rds').subscribe(data => {
      this.responseFromAWS = data;
    });
  }

  terminateInstances() {
    for (const instance of this.rdsInstances) {
      if (instance.checked) {
        this.amazonWebService.terminateAWS('rds', instance.id).subscribe(data => {
          this.responseFromAWS = data;
        });
      } else {
        this.responseFromAWS = 'No instances checked for termination';
      }
    }
  }

  getRunningHours(startTime): number {
    const hours = moment.duration(moment().diff(startTime)).asHours();
    return Math.round(hours * 100) / 100;
  }

  getCost(hours, instance): number {
    let totalCost = 0;
    this.amazonWebService.getPrice('rds', {
      region: instance.AvailabilityZone,
      type: instance.DBInstanceClass,
      DB: instance.Engine
    }).subscribe(price => {
      totalCost = hours * price;
    });
    return totalCost;
  }
}

export interface RDSInstance {
  id: string;
  context: string;
  name: string;
  type: string;
  engine: string;
  zone: string;
  status: string;
  creationDate: string;
  runningHours: number;
  cost: number;
  checked: boolean;
}
