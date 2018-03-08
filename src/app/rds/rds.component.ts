import { Component, OnInit } from '@angular/core';
import { AmazonWebService } from '../services/amazonweb.service';

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
          const instanceData = {
            id: instance.DBInstanceIdentifier,
            context: '',
            name: instance.DBName,
            type: instance.DBInstanceClass,
            engine: instance.Engine,
            zone: instance.AvailabilityZone,
            status: instance.DBInstanceStatus,
            creationDate: instance.InstanceCreateTime,
            checked: false
          };
          this.rdsInstances.push(instanceData);
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
  checked: boolean;
}
