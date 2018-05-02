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
  public loading: boolean;

  constructor(private amazonWebService: AmazonWebService) { }

  /**
   * Sets up instances on component initialization.
   */
  ngOnInit() {
    this.setupInstances();
  }

  /**
   * Gets all EFS instance data and creates instance array.
   */
  setupInstances() {
    this.loading = true;
    this.efsInstances = [];
    this.amazonWebService.describe('efs').subscribe(data => {
      if (data !== 'No efs data') {
        for (const instance of data) {
          const instanceData = {
            id: instance.FileSystemId,
            context: this.amazonWebService.getTag(instance.Tags, 'Context'),
            name: this.amazonWebService.getTag(instance.Tags, 'Name'),
            zone: this.amazonWebService.getTag(instance.Tags, 'Region'),
            size: instance.SizeInBytes.Value,
            status: instance.LifeCycleState,
            creationDate: instance.CreationTime,
            checked: false
          };
          this.efsInstances.push(instanceData);
        }
      }
      this.loading = false;
    });
  }
  /**
   * Terminates all checked EFS instances.
   */
  terminateInstances() {
    this.loading = true;
    for (const instance of this.efsInstances) {
      if (instance.checked) {
        this.amazonWebService.destroy('efs', instance.id, 'ap-southeast-2').subscribe(data => {
          this.responseFromAWS = data;
        });
      }
    }
    setTimeout(() => {
      this.setupInstances();
    }, 3000);
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
