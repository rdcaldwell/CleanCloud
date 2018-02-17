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
      console.log('trying');
      this.context = data;
    });
  }

  getEC2Context() {
    this.amazonWebService.context('ec2', this.title).subscribe(data => {
      console.log(data);
      for (const instance of data) {
        const instanceData = {
          serviceType: 'ec2',
          id: instance.InstanceId,
          name: instance.Tags[1].Value,
          status: instance.State.Name
        };
        console.log(instanceData);
        this.clusterInstances.push(instanceData);
      }
    });
  }

  getEFSContext() {
    this.amazonWebService.describe('efs').subscribe(instances => {
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
                console.log(instanceData);
                this.clusterInstances.push(instanceData);
              }
            }
        });
      }
    });
  }

  getRDSContext() {
    this.amazonWebService.describe('rds').subscribe(instances => {
      for (const instance of instances) {
        console.log(instance);
        this.amazonWebService.describeTags('rds', instance.DBInstanceArn).subscribe(tags => {
            for (const tag of tags) {
              if (tag.Value === this.title) {
                const instanceData = {
                  serviceType: 'rds',
                  id: instance.DBInstanceIdentifier,
                  name: instance.DBName,
                  status: instance.DBInstanceStatus
                };
                console.log(instanceData);
                this.clusterInstances.push(instanceData);
              }
            }
        });
      }
    });
  }
  
  terminateClusterAWS() {
    for (const instance of this.clusterInstances) {
        this.amazonWebService.terminate(instance.serviceType, instance.id).subscribe();
    }
  }
}

interface ClusterInstance {
  serviceType: string;
  id: string;
  name: string;
  status: string;
}
