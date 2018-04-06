import { Component, OnInit } from '@angular/core';
import { AmazonWebService } from '../services/amazonweb.service';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';
import { AnalyticsComponent } from '../analytics/analytics.component';
@Component({
  selector: 'app-ec2',
  templateUrl: './ec2.component.html',
  styleUrls: ['./ec2.component.css']
})
export class Ec2Component implements OnInit {

  public responseFromAWS: any;
  public ec2Instances: Array<EC2Instance> = [];
  public totalCost = 0;

  constructor(private amazonWebService: AmazonWebService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.updateInstances();
  }

  updateInstances() {
    this.ec2Instances = [];
    this.amazonWebService.describe('ec2').subscribe(reservations => {
      if (reservations !== 'No ec2 data') {
        for (const reservation of reservations) {
          for (const instance of reservation.Instances) {
            const getRunningHours = new Promise((resolve, reject) => {
              resolve(this.getRunningHours(instance.LaunchTime));
            });
            getRunningHours.then((hours: number) => {
              const getTotalCost = new Promise((resolve, reject) => {
                this.amazonWebService.getPrice('ec2', {
                  region: instance.Placement.AvailabilityZone,
                  type: instance.InstanceType,
                }).subscribe(price => {
                  resolve(hours * price);
                });
              });
              getTotalCost.then((price) => {
                this.ec2Instances.push({
                  id: instance.InstanceId,
                  context: instance.Tags.length > 0 ? this.getTag(instance.Tags, 'Context') : null,
                  name: instance.Tags.length > 0 ? this.getTag(instance.Tags, 'Name') : null,
                  type: instance.InstanceType,
                  dns: instance.PublicDnsName,
                  zone: instance.Placement.AvailabilityZone,
                  status: instance.State.Name,
                  creationDate: instance.LaunchTime,
                  runningHours: hours,
                  cost: price,
                  checked: false
                });
              });
            });
          }
        }
        setInterval(() => {
          this.updateStatus();
        }, 30000);
      } else {
        this.responseFromAWS = reservations;
      }
    });
  }

  updateStatus() {
    this.amazonWebService.describe('ec2').subscribe(reservations => {
      if (reservations !== 'No ec2 data') {
        for (const reservation of reservations) {
          for (const instance of reservation.Instances) {
            for (const ec2Instance of this.ec2Instances) {
              if (ec2Instance.id === instance.InstanceId) {
                ec2Instance.status = instance.State.Name;
              }
            }
          }
        }
      } else {
        this.responseFromAWS = reservations;
      }
    });
  }

  terminateInstances() {
    for (const instance of this.ec2Instances) {
      if (instance.checked) {
        this.amazonWebService.terminateAWS('ec2', instance.id).subscribe(data => {
          this.responseFromAWS = data;
        });
      } else {
        this.responseFromAWS = 'No instances checked for termination';
      }
    }
  }

  openAnalytics(instance) {
    this.amazonWebService.analyze(instance).subscribe(data => {
      this.dialog.open(AnalyticsComponent, {
        width: '75%',
        data: { response: data.Datapoints, name: instance.name },
      });
    });
  }

  getTag(tags, key) {
    for (const tag of tags) {
      if (tag.Key === key) {
        return tag.Value;
      }
    }
  }

  getRunningHours(startTime): number {
    const hours = moment.duration(moment().diff(startTime)).asHours();
    return Math.round(hours * 100) / 100;
  }
}

export interface EC2Instance {
  id: string;
  context: string;
  name: string;
  type: string;
  dns: string;
  zone: string;
  status: string;
  creationDate: Date;
  runningHours: any;
  cost: any;
  checked: boolean;
}
