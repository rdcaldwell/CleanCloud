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
  public loading: boolean;

  constructor(private amazonWebService: AmazonWebService) { }

  /**
   * Sets up instances on component initialization.
   */
  ngOnInit() {
    this.setupInstances();
  }

  /**
   * Gets all RDS instance data and creates instance array.
   */
  setupInstances() {
    this.loading = true;
    this.rdsInstances = [];
    this.amazonWebService.describe('rds').subscribe(data => {
      if (data !== 'No rds data') {
        for (const instance of data) {
          const hours = this.amazonWebService.getRunningHours(instance.InstanceCreateTime);
          this.amazonWebService.getPrice('rds', {
            region: (instance.DBInstanceStatus !== 'creating') ? instance.AvailabilityZone : '',
            type: instance.DBInstanceClass,
            DB: instance.Engine
          }).subscribe(price => {
            this.rdsInstances.push({
              id: instance.DBInstanceIdentifier,
              name: instance.DBName,
              type: instance.DBInstanceClass,
              engine: instance.Engine,
              zone: (instance.AvailabilityZone) ? instance.AvailabilityZone.slice(0, -1) : '',
              status: instance.DBInstanceStatus,
              creationDate: instance.InstanceCreateTime,
              runningHours: hours,
              cost: hours * price,
              checked: false
            });
          });
        }
      }
      this.loading = false;
    });
  }

  /**
   * Terminates all checked RDS instances.
   */
  terminateInstances() {
    this.loading = true;
    for (const instance of this.rdsInstances) {
      if (instance.checked) {
        this.amazonWebService.destroy('rds', instance.id, instance.zone).subscribe(data => {
          this.responseFromAWS = data;
        });
      }
    }
    setTimeout(() => {
      this.setupInstances();
    }, 3000);
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
