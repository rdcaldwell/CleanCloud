import { Component, OnInit } from '@angular/core';
import { AmazonWebService } from '../services/amazonweb.service';

@Component({
  selector: 'app-ec2',
  templateUrl: './ec2.component.html',
  styleUrls: ['./ec2.component.css']
})
export class Ec2Component implements OnInit {
  public ec2Instances: Array<EC2Instance> = [];

  constructor(private amazonWebService: AmazonWebService) { }

  ngOnInit() {
    this.updateInstances();
  }

  updateInstances() {
    this.ec2Instances = [];
    this.amazonWebService.describe('ec2').subscribe(reservations => {
      if (reservations !== 'No ec2 data') {
        for (const reservation of reservations) {
          for (const instance of reservation.Instances) {
            const instanceData = {
              id: instance.InstanceId,
              context: instance.Tags.length > 0 ? instance.Tags[1].Value : null,
              name: instance.Tags.length > 0 ? instance.Tags[0].Value : null,
              type: instance.InstanceType,
              dns: instance.PublicDnsName,
              zone: instance.Placement.AvailabilityZone,
              status: instance.State.Name,
              creationDate: instance.LaunchTime,
              checked: false
            };
            this.ec2Instances.push(instanceData);
          }
        }
        setInterval(() => {
          this.updateStatus();
        }, 5000);
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
      }
    });
  }

  createInstance() {
    this.amazonWebService.create('ec2').subscribe();
    this.updateInstances();
  }

  terminateInstances() {
    for (const instance of this.ec2Instances) {
      if (instance.checked) {
        this.amazonWebService.terminateAWS('ec2', instance.id).subscribe();
      }
    }
  }

  getCost() {
    for (const instance of this.ec2Instances) {
      if (instance.checked) {
        this.amazonWebService.cost(instance.name).subscribe();
      }
    }
  }
}

interface NewEC2Instance {
  region: string;
  highAvailability: string;
  orgImportPaths: string;
  verison: string;
  reason: string;
  context: string;
  startedBy: string;
}

interface EC2Instance {
  id: string;
  context: string;
  name: string;
  type: string;
  dns: string;
  zone: string;
  status: string;
  creationDate: Date;
  checked: boolean;
}
