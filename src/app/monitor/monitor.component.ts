import { Component, OnInit } from '@angular/core';
import { ClusterService } from '../services/cluster.service';
import { SimianArmyService } from '../services/simianarmy.service';
import { JobService } from '../services/job.service';
import { JenkinsService } from '../services/jenkins.service';
import { JanitorService } from '../services/janitor.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {

  public clusters = [];
  public janitorRunning: boolean;
  public loading = true;

  constructor(private clusterService: ClusterService,
    private simianArmyService: SimianArmyService,
    private jobService: JobService,
    private jenkinsService: JenkinsService,
    private janitorService: JanitorService) { }

  /**
   * Gets all clusters and checks if janitor is running on component initialization.
   */
  ngOnInit() {
    this.clusterService.getClusters().subscribe(data => {
      for (const cluster of data) {
        this.clusters.push(cluster);
      }
      this.loading = false;
    });
    this.isJanitorRunning();
  }

  /**
   * Opt instance out of Simian Army monitoring.
   * @param {object} cluster - The cluster to be opted out.
   */
  optOut(cluster) {
    for (const resource of cluster.resourceIds) {
      this.simianArmyService.optOut(resource).subscribe();
      this.clusterService.removeMonitor(cluster._id).subscribe();
    }
    cluster.monitored = false;
  }

  /**
   * Opt instance into Simian Army monitoring.
   * @param {object} cluster - The cluster to be opted in.
   */
  optIn(cluster) {
    for (const resource of cluster.resourceIds) {
      this.simianArmyService.optIn(resource).subscribe();
      this.clusterService.addMonitor(cluster._id).subscribe();
    }
    cluster.monitored = true;
  }

  /**
   * Cancel job to destroy cluster.
   * @param {object} cluster - The cluster of the job to canceled.
   */
  cancelJob(cluster) {
    this.jobService.cancelJob(cluster.context).subscribe(data => {
      cluster.marked = false;
      alert(data);
    });
  }

  /**
   * Destroy cluster using jenkins.
   * @param {object} cluster - The cluster to be destroyed.
   */
  destroy(cluster) {
    this.jenkinsService.destroy(cluster.context).subscribe(data => {
      alert(data);
      cluster.destroyed = true;
    });
  }

  /**
   * Checks if any cluster is marked.
   */
  isAnyClusterMarked() {
    for (const cluster of this.clusters) {
      if (cluster.marked) {
        return true;
      }
    }
    return false;
  }

  isJanitorRunning() {
    this.janitorService.isJanitorRunning().subscribe((running) => {
      this.janitorRunning = running;
    });
  }

}
