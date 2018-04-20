import { Component, OnInit } from '@angular/core';
import { AmazonWebService } from '../services/amazonweb.service';

@Component({
  selector: 'app-efs',
  templateUrl: './efs.component.html',
  styleUrls: ['./efs.component.css']
})
export class EfsComponent implements OnInit {

  public responseFromAWS: any;
  public efsInstances: Array<EFSInstance> = [];
  public loading = true;

  constructor(private amazonWebService: AmazonWebService) { }

  ngOnInit() {
    this.amazonWebService.describe('efs').subscribe(data => {
      if (data !== 'No efs data') {
        for (const instance of data) {
          const instanceData = {
            id: instance.FileSystemId,
            context: this.getTag(instance.Tags, 'Context'),
            name: this.getTag(instance.Tags, 'Name'),
            zone: this.getTag(instance.Tags, 'Region'),
            size: instance.SizeInBytes.Value,
            status: instance.LifeCycleState,
            creationDate: instance.CreationTime,
            checked: false
          };
          this.efsInstances.push(instanceData);
        }
        setInterval(() => {
          this.updateStatus();
        }, 30000);
      } else {
        this.responseFromAWS = data;
      }
      this.loading = false;
    });
  }

  updateStatus() {
    this.amazonWebService.describe('efs').subscribe(data => {
      if (data !== 'No efs data') {
        for (const instance of data) {
          for (const efsInstance of this.efsInstances) {
            if (efsInstance.id === instance.FileSystemId) {
              efsInstance.status = instance.LifeCycleState;
            }
          }
        }
      } else {
        this.responseFromAWS = data;
      }
    });
  }

  terminateInstances() {
    for (const instance of this.efsInstances) {
      if (instance.checked) {
        this.amazonWebService.destroy('efs', instance.id, instance.zone).subscribe(data => {
          this.responseFromAWS = data;
        });
      } else {
        this.responseFromAWS = 'No instances checked for termination';
      }
    }
  }

  getTag(tags, key) {
    for (const tag of tags) {
      if (tag.Key === key) {
        return tag.Value;
      }
    }
  }

}

export interface EFSInstance {
  id: string;
  context: string;
  name: string;
  zone: string;
  size: number;
  status: string;
  creationDate: string;
  checked: boolean;
}
