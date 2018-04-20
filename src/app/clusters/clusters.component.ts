import { Component, OnInit } from '@angular/core';
import { AmazonWebService } from '../services/amazonweb.service';
import { ClusterService } from '../services/cluster.service';

@Component({
  selector: 'app-clusters',
  templateUrl: './clusters.component.html',
  styleUrls: ['./clusters.component.css']
})
export class ClustersComponent implements OnInit {

  public loading = true;
  public context = [];

  constructor(private clusterService: ClusterService) { }

  ngOnInit() {
    this.clusterService.contextNames().subscribe(data => {
      this.context = data;
      this.loading = false;
    });
  }

}
