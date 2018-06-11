/** @module ClusterComponent */
import { Component, OnInit, Input } from '@angular/core';
import { AmazonWebService } from '../../services/amazonweb.service';
import * as moment from 'moment';
import { ClusterService } from '../../services/cluster.service';
import { JenkinsService } from '../../services/jenkins.service';

@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.css']
})
export class ClusterComponent implements OnInit {

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

  /**
   * Sets up instances on component initialization.
   */
  ngOnInit() {
    this.setupInstances();
  }

  /**
   * Formulates clusters of all resources.
   */
  setupInstances() {
    this.clusterInstances = [];
    this.totalCost = 0;
    this.getEFSContext();
    this.getEC2Context();
    this.getRDSContext();
  }

  /**
   * Finds all EC2 instances matching the cluster name.
   */
  getEC2Context() {
    let ec2Hours = 0;
    this.clusterService.context(this.cluster.name, this.cluster.region).subscribe(reservations => {
      if (reservations !== 'No ec2 data') {
        for (const reservation of reservations) {
          for (const instance of reservation.Instances) {
            const instanceData = {
              serviceType: 'ec2',
              id: instance.InstanceId,
              name: this.amazonWebService.getTag(instance.Tags, 'Name'),
              status: instance.State.Name
            };

            ec2Hours += moment.duration(moment().diff(instance.LaunchTime)).asHours();

            this.startedBy = this.amazonWebService.getTag(instance.Tags, 'StartedBy');

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
      this.loading = false;
    });
  }

  /**
   * Finds all EFS file systems matching the cluster name.
   */
  getEFSContext() {
    this.amazonWebService.describe('efs').subscribe(instances => {
      if (instances !== 'No efs data') {
        for (const instance of instances) {
          for (const tag of instance.Tags) {
            if (tag.Key === 'Context' && tag.Value === this.cluster.name) {
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

  /**
   * Finds all RDS databases matching the cluster name.
   */
  getRDSContext() {
    let rdsHours = 0;
    this.amazonWebService.describe('rds').subscribe(instances => {
      if (instances !== 'No rds data') {
        for (const instance of instances) {
          for (const tag of instance.Tags) {
            if (tag.Key === 'Context' && tag.Value === this.cluster.name) {
              const instanceData = {
                serviceType: 'rds',
                id: instance.DBInstanceIdentifier,
                name: instance.DBName,
                status: instance.DBInstanceStatus
              };
              rdsHours += moment.duration(moment().diff(instance.InstanceCreateTime)).asHours();
              this.clusterInstances.push(instanceData);
              this.amazonWebService.getPrice('rds', {
                region: (instance.DBInstanceStatus !== 'creating') ? instance.AvailabilityZone : '',
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

  /**
   * Terminates all instances of cluster using AWS.
   */
  terminateClusterAWS() {
    this.loading = true;
    for (const instance of this.clusterInstances) {
      this.amazonWebService.destroy(instance.serviceType, instance.id, this.cluster.region).subscribe(data => {
        this.responseFromAWS = data;
      });
    }
    setTimeout(() => {
      this.setupInstances();
    }, 5000);
  }

  /**
   * Terminates all instances of cluster using Jenkins pipeline.
   */
  terminateClusterJenkins() {
    this.loading = true;
    this.jenkinsService.destroy(this.cluster.name).subscribe(data => {
      this.responseFromAWS = data;
    });
    setTimeout(() => {
      this.setupInstances();
    }, 10000);
  }
}

export interface ClusterInstance {
  serviceType: string;
  id: string;
  name: string;
  status: string;
}
