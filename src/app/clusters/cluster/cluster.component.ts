import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { AmazonWebService } from '../../services/amazonweb.service';
import * as moment from 'moment';
import { ClusterService } from '../../services/cluster.service';
import { JenkinsService } from '../../services/jenkins.service';
@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.css']
})
export class ClusterComponent implements OnInit, AfterViewInit {

  @Input() public cluster: any;
  public startedBy: string;
  public context: any = [];
  public clusterInstances: Array<ClusterInstance> = [];
  public totalCost = 0;
  public responseFromAWS: any;
  public loading = true;

  constructor(private amazonWebService: AmazonWebService,
    private clusterService: ClusterService,
    private jenkinsService: JenkinsService) { }

  ngOnInit() {
    this.getEFSContext();
    this.getEC2Context();
    this.getRDSContext();
  }

  ngAfterViewInit() {
    this.loading = false;
  }

  getEC2Context() {
    let ec2Hours = 0;
    this.clusterService.context('ec2', this.cluster.name, this.cluster.region).subscribe(reservations => {
      if (reservations !== 'No ec2 data') {
        for (const reservation of reservations) {
          for (const instance of reservation.Instances) {
            const instanceData = {
              serviceType: 'ec2',
              id: instance.InstanceId,
              name: this.getTag(instance.Tags, 'Name'),
              status: instance.State.Name
            };

            ec2Hours += moment.duration(moment().diff(instance.LaunchTime)).asHours();

            this.startedBy = this.getTag(instance.Tags, 'startedBy');

            this.clusterInstances.push(instanceData);

            this.amazonWebService.getPrice('ec2', {
              region: instance.Placement.AvailabilityZone,
              type: instance.InstanceType,
            }).subscribe(price => {
              this.totalCost += ec2Hours * price;
            });
          }
        }
      } else {
        this.responseFromAWS = reservations;
      }
    });
  }

  getEFSContext() {
    this.amazonWebService.describe('efs').subscribe(instances => {
      if (instances !== 'No efs data') {
        for (const instance of instances) {
          for (const tag of instance.Tags) {
            if (tag.Value === this.cluster.name) {
              const instanceData = {
                serviceType: 'efs',
                id: instance.FileSystemId,
                name: instance.Name,
                status: instance.LifeCycleState
              };
              this.clusterInstances.push(instanceData);
            }
          }
        }
      } else {
        this.responseFromAWS = instances;
      }
    });
  }

  getRDSContext() {
    let rdsHours = 0;
    this.amazonWebService.describe('rds').subscribe(instances => {
      if (instances !== 'No rds data') {
        for (const instance of instances) {
          for (const tag of instance.Tags) {
            if (tag.Value === this.cluster.name) {
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
        }
      } else {
        this.responseFromAWS = instances;
      }
    });
  }

  terminateClusterAWS() {
    for (const instance of this.clusterInstances) {
      this.amazonWebService.destroy(instance.serviceType, instance.id, this.cluster.region).subscribe(data => {
        this.responseFromAWS = data;
      });
    }
  }

  terminateClusterJenkins() {
    this.jenkinsService.destroy(this.cluster.name).subscribe(data => {
      this.responseFromAWS = data;
    });
  }

  getTag(tags, key) {
    for (const tag of tags) {
      if (tag.Key === key) {
        return tag.Value;
      }
    }
  }
}

export interface ClusterInstance {
  serviceType: string;
  id: string;
  name: string;
  status: string;
}
