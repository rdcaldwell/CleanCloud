import { Component, OnInit, Input } from '@angular/core';
import { AmazonWebService } from '../services/amazonweb.service';
import * as moment from 'moment';
@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.css']
})
export class ClusterComponent implements OnInit {
  @Input() private title: any;
  createdOn: string;
  startedBy: string;
  orgImportPath: string;
  version: string;
  reason: string;
  highAvailability: string;
  monitor = true;
  context: any = [];
  public clusterInstances: Array<ClusterInstance> = [];
  totalCost = 0;

  constructor(private amazonWebService: AmazonWebService) { }

  ngOnInit() {
    this.getEFSContext();
    this.getEC2Context();
    this.getRDSContext();
  }

  getEC2Context() {
    let ec2Hours = 0;
    this.amazonWebService.context('ec2', this.title).subscribe(reservations => {
      if (reservations !== 'No ec2 data') {
        for (const reservation of reservations) {
          for (const instance of reservation.Instances) {
            const instanceData = {
              serviceType: 'ec2',
              id: instance.InstanceId,
              name: this.getName(instance.Tags),
              status: instance.State.Name
            };
            ec2Hours += moment.duration(moment().diff(instance.LaunchTime)).asHours();
            this.clusterInstances.push(instanceData);
            this.amazonWebService.getPrice('ec2', {
              region: instance.Placement.AvailabilityZone,
              type: instance.InstanceType,
            }).subscribe(price => {
              this.totalCost += ec2Hours * price;
            });
          }
        }
      }
    });
  }

  getEFSContext() {
    this.amazonWebService.describe('efs').subscribe(instances => {
      if (instances !== 'No efs data') {
        for (const instance of instances) {
          this.amazonWebService.describeTags('efs', instance.FileSystemId).subscribe(tags => {
            for (const tag of tags) {
              if (tag.Value === this.title) {
                const instanceData = {
                  serviceType: 'efs',
                  id: instance.FileSystemId,
                  name: instance.Name,
                  status: instance.LifeCycleState
                };
                this.clusterInstances.push(instanceData);
              }
            }
          });
        }
      }
    });
  }

  getRDSContext() {
    let rdsHours = 0;
    this.amazonWebService.describe('rds').subscribe(instances => {
      if (instances !== 'No rds data') {
        for (const instance of instances) {
          this.amazonWebService.describeTags('rds', instance.DBInstanceArn).subscribe(tags => {
            for (const tag of tags) {
              if (tag.Value === this.title) {
                const instanceData = {
                  serviceType: 'rds',
                  id: instance.DBInstanceIdentifier,
                  name: instance.DBName,
                  status: instance.DBInstanceStatus
                };
                rdsHours += moment.duration(moment().diff(instance.InstanceCreateTime)).asHours();
                this.clusterInstances.push(instanceData);
                this.amazonWebService.getPrice('rds', {
                  region: instance.AvailabilityZone,
                  type: instance.DBInstanceClass,
                  DB: instance.Engine
                }).subscribe(price => {
                  this.totalCost += rdsHours * price;
                });
              }
            }
          });
        }
      }
    });
  }

  terminateClusterAWS() {
    for (const instance of this.clusterInstances) {
      this.amazonWebService.terminateAWS(instance.serviceType, instance.id).subscribe();
    }
  }

  terminateClusterJenkins() {
    this.amazonWebService.destroyCluster(this.title).subscribe();
  }

  getName(tags) {
    for (const tag of tags) {
      if (tag.Key === 'Name') {
        return tag.Value;
      }
    }
  }
}

interface ClusterInstance {
  serviceType: string;
  id: string;
  name: string;
  status: string;
}
