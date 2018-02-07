import { Component, OnInit, Input } from '@angular/core';
import { InstancesService } from '../services/instances.service';
import $ from 'jquery';

@Component({
  selector: 'instances',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.css'],
  providers: [InstancesService]
})
export class InstanceComponent implements OnInit {
  data: any = [];
  createdInstance: any = [];
  activeId: string;
  resdata: any;

  constructor(private instancesService: InstancesService) {}

  ngOnInit() {
    this.getInstanceData();
    this.instancesService.id.subscribe(id => this.activeId = id);
    /*
    setInterval(() => { 
        this.getInstanceData(); 
    }, 2500);
    */
  }

  getInstanceData() {
    this.instancesService.getInstances().subscribe(data => {
      this.data = data;
    });
  }

  createInstance() {
    this.instancesService.create().subscribe();
  }

  terminateInstance() {
    this.instancesService.terminate(this.activeId).subscribe();
  }

  activateRow(id) {
    $('#instanceTable').on('click', '.clickable-row', function(event) {
      $(this).addClass('active').siblings().removeClass('active');
    });
    this.instancesService.setActiveId(id);
  }
}
