import { Component, OnInit, Input } from '@angular/core';
import { ContextService } from '../services/context.service';

@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.css']
})
export class ClusterComponent implements OnInit {
  @Input() private title: any;
  ec2_context: any = [];
  efs_context: any = [];
  rds_context: any = [];
  
  constructor(private contextService: ContextService) { }

  ngOnInit() {
    this.getEC2Context();
    for (let instance of this.ec2_context) {

    }
  }

  getEC2Context() {
    this.contextService.context('ec2', "Test").subscribe(data => {
      console.log(data);
      this.ec2_context = data;
    });
  }

  getEFSContext() {
    this.contextService.context('efs', this.title).subscribe(data => {
      this.efs_context = data;
    });
  }

  getRDSContext() {
    this.contextService.context('rds', this.title).subscribe(data => {
      this.rds_context = data;
    });
  }
}

interface Instance {
  type: string,
  id: string,
  availabilityZone: string,
  status: string,
  createdOn: string,
  startedBy: string,
  orgImportPath: string,
  version: string,
  reason: string,
  highAvailability: string,
  monitor: boolean
}