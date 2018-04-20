import { Component, OnInit } from '@angular/core';
import { AmazonWebService } from '../services/amazonweb.service';
import * as moment from 'moment';

@Component({
  selector: 'app-rds',
  templateUrl: './rds.component.html',
  styleUrls: ['./rds.component.css']
})
export class RdsComponent implements OnInit {

  public responseFromAWS: any;
  public rdsInstances: Array<RDSInstance> = [];
  public totalCost = 0;
  public loading = true;

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
              if (instance.AvailabilityZone) {
                this.amazonWebService.getPrice('rds', {
                  region: instance.AvailabilityZone,
                  type: instance.DBInstanceClass,
                  DB: instance.Engine
                }).subscribe(price => {
                  resolve(hours * price);
                });
              } else {
                resolve(0);
              }
            });

            getTotalCost.then((price: number) => {
              this.rdsInstances.push({
                id: instance.DBInstanceIdentifier,
                name: instance.DBName,
                type: instance.DBInstanceClass,
                engine: instance.Engine,
                zone: instance.AvailabilityZone.slice(0, -1),
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
        }, 30000);
      } else {
        this.responseFromAWS = data;
      }
      this.loading = false;
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

  terminateInstances() {
    for (const instance of this.rdsInstances) {
      if (instance.checked) {
        this.amazonWebService.destroy('rds', instance.id, instance.zone).subscribe(data => {
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
}

export interface RDSInstance {
  id: string;
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
