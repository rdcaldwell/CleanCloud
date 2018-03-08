import { Component, OnInit, Input } from '@angular/core';
import { AmazonWebService } from '../services/amazonweb.service';

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

  constructor(private amazonWebService: AmazonWebService) { }

  ngOnInit() {
    this.getContextNames();
    this.getEFSContext();
    this.getEC2Context();
    this.getRDSContext();
  }

  getContextNames() {
    this.amazonWebService.contextNames().subscribe(data => {
      this.context = data;
    });
  }

  getEC2Context() {
    this.amazonWebService.context('ec2', this.title).subscribe(data => {
      if (data !== 'No ec2 data') {
        for (const instance of data) {
          const instanceData = {
            serviceType: 'ec2',
            id: instance.InstanceId,
            name: instance.Tags[0].Value,
            status: instance.State.Name
          };
          this.clusterInstances.push(instanceData);
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
                this.clusterInstances.push(instanceData);
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
      this.amazonWebService.terminateJenkins().subscribe();
  }
}

interface ClusterInstance {
  serviceType: string;
  id: string;
  name: string;
  status: string;
}
