import { Component, OnInit } from '@angular/core';
import { ClusterService } from '../services/cluster.service';
import { JobService } from '../services/job.service';
import { JenkinsService } from '../services/jenkins.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {

  public clusters = [];
  public loading = true;

  constructor(private clusterService: ClusterService,
    private jobService: JobService,
    private jenkinsService: JenkinsService) { }

  /**
   * Gets all clusters on component initialization.
   */
  ngOnInit() {
    this.clusterService.getClusters().subscribe(data => {
      for (const cluster of data) {
        this.clusters.push(cluster);
      }
      this.loading = false;
    });
  }

  /**
   * Opt instance out of monitoring.
   * @param {object} cluster - The cluster to be opted out.
   */
  optOut(cluster) {
    this.clusterService.removeMonitor(cluster._id).subscribe();
    cluster.monitored = false;
  }

  /**
   * Opt instance into monitoring.
   * @param {object} cluster - The cluster to be opted in.
   */
  optIn(cluster) {
    this.clusterService.addMonitor(cluster._id).subscribe();
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

}
