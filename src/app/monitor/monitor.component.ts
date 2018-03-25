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
    cluster.monitored = false;
  }

  optIn(cluster) {
    for (const resource of cluster.resourceIds) {
      this.amazonWebService.optIn(cluster.monkeyPort, resource).subscribe();
    }
    cluster.monitored = true;
  }

  unmark(cluster) {
    this.amazonWebService.unmarkCluster(cluster.context).subscribe();
    cluster.marked = false;
  }

  destroy(cluster) {
    this.amazonWebService.destroyCluster(cluster.context).subscribe();
    cluster.destroyed = true;
  }

  isAnyClusterMarked() {
    for (const cluster of this.clusters) {
      if (cluster.marked) {
        return true;
      }
    }
    return false;
  }
}
