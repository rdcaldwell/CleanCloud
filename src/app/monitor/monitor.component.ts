import { Component, OnInit } from '@angular/core';
import { AmazonWebService } from '../services/amazonweb.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {
  public clusters = [];

  constructor(private amazonWebService: AmazonWebService) { }

  ngOnInit() {
    this.amazonWebService.getClusters().subscribe(data => {
      for (const cluster of data) {
        this.clusters.push(cluster);
      }
    });
  }

  optOut(cluster) {
    for (const resource of cluster.resourceIds) {
      this.amazonWebService.optOut(cluster.monkeyPort, resource).subscribe();
    }
  }

  optIn(cluster) {
    for (const resource of cluster.resourceIds) {
      this.amazonWebService.optIn(cluster.monkeyPort, resource).subscribe();
    }
  }

  unmark(cluster) {
    this.amazonWebService.unmarkCluster(cluster.context).subscribe();
  }

  destroy(cluster) {
    this.amazonWebService.destroyCluster(cluster.context).subscribe();
  }

}
