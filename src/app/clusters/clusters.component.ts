import { Component, OnInit } from '@angular/core';
import { AmazonWebService } from '../services/amazonweb.service';

@Component({
  selector: 'app-clusters',
  templateUrl: './clusters.component.html',
  styleUrls: ['./clusters.component.css']
})
export class ClustersComponent implements OnInit {

  public context: any = {
    names: []
  };

  constructor(private amazonWebService: AmazonWebService) { }

  ngOnInit() {
    this.getContextNames();
  }

  getContextNames() {
    this.amazonWebService.contextNames().subscribe(data => {
      this.context = data;
    });
  }
}
