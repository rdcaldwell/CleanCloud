import { Component, OnInit } from '@angular/core';
import { AmazonWebService } from '../services/amazonweb.service';
import { MatDialog } from '@angular/material';
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
  public loading: boolean;

  constructor(private amazonWebService: AmazonWebService,
    public dialog: MatDialog) { }

  /**
   * Sets up instances on component initialization.
   */
  ngOnInit() {
    this.setupInstances();
  }

  /**
   * Gets all EC2 instance data and creates instance array.
   */
  setupInstances() {
    this.loading = true;
    this.ec2Instances = [];
    this.amazonWebService.describe('ec2').subscribe(reservations => {
      if (reservations !== 'No ec2 data') {
        for (const reservation of reservations) {
          for (const instance of reservation.Instances) {
            const hours = this.amazonWebService.getRunningHours(instance.LaunchTime);
            this.amazonWebService.getPrice('ec2', {
              region: instance.Placement.AvailabilityZone,
              type: instance.InstanceType,
            }).subscribe(price => {
              this.ec2Instances.push({
                id: instance.InstanceId,
                context: instance.Tags.length > 0 ? this.amazonWebService.getTag(instance.Tags, 'Context') : null,
                name: instance.Tags.length > 0 ? this.amazonWebService.getTag(instance.Tags, 'Name') : null,
                type: instance.InstanceType,
                dns: instance.PublicDnsName,
                zone: instance.Placement.AvailabilityZone.slice(0, -1),
                status: instance.State.Name,
                creationDate: instance.LaunchTime,
                runningHours: hours,
                cost: hours * price,
                checked: false
              });
            });
          }
        }
      }
      this.loading = false;
    });
  }

  /**
   * Terminates all checked EC2 instances.
   */
  terminateInstances() {
    this.loading = true;
    for (const instance of this.ec2Instances) {
      if (instance.checked) {
        this.amazonWebService.destroy('ec2', instance.id, instance.zone).subscribe(data => {
          this.responseFromAWS = data;
        });
      }
    }
    setTimeout(() => {
      this.setupInstances();
    }, 3000);
  }

  /**
   * Opens the analytics modal with CloudWatch CPU Utilization metrics.
   * @param {object} instance - The instance data.
   */
  openAnalytics(instance) {
    this.amazonWebService.analyze(instance).subscribe(data => {
      this.dialog.open(AnalyticsComponent, {
        width: '75%',
        data: { response: data.Datapoints, name: instance.name },
      });
    });
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
