import { Component, OnInit } from '@angular/core';
import { AmazonWebService } from '../services/amazonweb.service';

@Component({
  selector: 'app-efs',
  templateUrl: './efs.component.html',
  styleUrls: ['./efs.component.css']
})
export class EfsComponent implements OnInit {
  efs_data: any = [];
  public efsInstances: Array<EFSInstance> = [];

  constructor(private amazonWebService: AmazonWebService) { }

  ngOnInit() {
    this.amazonWebService.describe('efs').subscribe(data => {
      if (data !== 'No efs data') {
        for (const instance of data) {
          const instanceData = {
            id: instance.FileSystemId,
            context: '',
            name: '',
            size: instance.SizeInBytes.Value,
            status: instance.LifeCycleState,
            creationDate: instance.CreationTime,
            checked: false
          };
          this.efsInstances.push(instanceData);
        }
        setInterval(() => {
          this.updateStatus();
        }, 5000);
      }
    });
  }

  updateStatus() {
    this.amazonWebService.describe('efs').subscribe(data => {
      for (const instance of data) {
        for (const efsInstance of this.efsInstances) {
          if (efsInstance.id === instance.FileSystemId) {
            efsInstance.status = instance.LifeCycleState;
          }
        }
      }
    });
  }

  createInstance() {
    this.amazonWebService.create('efs').subscribe();
  }

  terminateInstances() {
    for (const instance of this.efsInstances) {
      if (instance.checked) {
        this.amazonWebService.terminateAWS('efs', instance.id).subscribe();
      }
    }
  }
}

interface EFSInstance {
  id: string;
  context: string;
  name: string;
  size: number;
  status: string;
  creationDate: string;
  checked: boolean;
}
