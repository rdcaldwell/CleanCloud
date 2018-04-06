import { Component, OnInit } from '@angular/core';
import { AmazonWebService } from '../services/amazonweb.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {

  public clusters = [];
  public janitorRunning: boolean;

  constructor(private amazonWebService: AmazonWebService) { }

  ngOnInit() {
    this.amazonWebService.getClusters().subscribe(data => {
      for (const cluster of data) {
        this.clusters.push(cluster);
      }
    });
    this.isJanitorRunning();
  }

  optOut(cluster) {
    for (const resource of cluster.resourceIds) {
      this.amazonWebService.optOut(resource).subscribe();
      this.amazonWebService.removeMonitor(cluster._id).subscribe();
    }
    cluster.monitored = false;
  }

  optIn(cluster) {
    for (const resource of cluster.resourceIds) {
      this.amazonWebService.optIn(resource).subscribe();
      this.amazonWebService.addMonitor(cluster._id).subscribe();
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

  isJanitorRunning() {
    this.amazonWebService.isJanitorRunning().subscribe((running) => {
      this.janitorRunning = running;
    });
  }
}
