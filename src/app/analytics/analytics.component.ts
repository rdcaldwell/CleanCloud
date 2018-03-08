import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../services/analytics.service';
import { AmazonWebService } from '../services/amazonweb.service';
import * as d3 from 'd3';
import * as moment from 'moment';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
  providers: [AmazonWebService]
})
export class AnalyticsComponent implements OnInit {
  data: any;

  constructor(private analyticsService: AnalyticsService,
              private amazonWebService: AmazonWebService) { }

  ngOnInit() {
  }
}
