import { Component, OnInit } from '@angular/core';
import { AmazonWebService } from '../services/amazonweb.service';
import * as moment from 'moment';

@Component({
  selector: 'app-rds',
  templateUrl: './rds.component.html',
  styleUrls: ['./rds.component.css']
})
export class RdsComponent implements OnInit {
  public rdsInstances: Array<RDSInstance> = [];

  constructor(private amazonWebService: AmazonWebService) { }

  ngOnInit() {
    this.amazonWebService.describe('rds').subscribe(data => {
      if (data !== 'No rds data') {
        for (const instance of data) {
          const getRunningHours = new Promise((resolve, reject) => {
            resolve(moment.duration(moment().diff(instance.InstanceCreateTime)).asHours());
          });
          getRunningHours.then((hours: number) => {
            const getTotalCost = new Promise((resolve, reject) => {
              this.amazonWebService.getPrice('rds', {
                region: instance.AvailabilityZone,
                type: instance.DBInstanceClass,
                DB: instance.Engine
              }).subscribe(price => {
                resolve(hours * price);
              });
            });
            getTotalCost.then((price) => {
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
      }
    });
  }

  createInstance() {
    this.amazonWebService.create('rds').subscribe();
  }

  terminateInstances() {
    for (const instance of this.rdsInstances) {
      if (instance.checked) {
        this.amazonWebService.terminateAWS('rds', instance.id).subscribe();
      }
    }
  }

  getRunningHours(startTime) {
    return moment.duration(moment().diff(startTime)).asHours();
  }
}

interface RDSInstance {
  id: string;
  context: string;
  name: string;
  type: string;
  engine: string;
  zone: string;
  status: string;
  creationDate: string;
  runningHours: any;
  cost: any;
  checked: boolean;
}
