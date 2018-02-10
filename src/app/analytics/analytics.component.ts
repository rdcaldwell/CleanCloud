import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../services/analytics.service';
import { InstancesService } from '../services/instances.service';
import * as d3 from "d3";
import * as moment from 'moment';

@Component({
  selector: 'analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
  providers: [InstancesService]
})
export class AnalyticsComponent implements OnInit {
  data: any;
  activeId: string;

  constructor(private analyticsService: AnalyticsService,
              private instancesService: InstancesService) { 

  }

  ngOnInit() {
    this.instancesService.id.subscribe(currentId => this.activeId = currentId);
  }

  analyzeInstance() {
    this.analyticsService.analyze(this.activeId).subscribe(data => {
      this.data = data;

      var data = this.data.Datapoints;

      console.log("data:" + data);
      
      // set the dimensions of the canvas
      var margin = {top: 20, right: 20, bottom: 200, left: 40},
              width = 1080 - margin.left - margin.right,
              height = 600 - margin.top - margin.bottom;

      // set the ranges
      var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

      var y = d3.scale.linear().range([height, 0]);

      // define the axis
      var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom")

      var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left")
              .ticks(10);

      // add the SVG element
      var svg = d3.select("#graph").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",
                      "translate(" + margin.left + "," + margin.top + ")");

          data.forEach(function(d) {
              d.Timestamp = new Date(d.Timestamp);
              d.Average = +d.Average;
          });

          function sortByDateAscending(a, b) {
              return a.Timestamp - b.Timestamp;
          }

          data = data.sort(sortByDateAscending);

          data.forEach(function(d) {
              d.Timestamp = moment(d.Timestamp).format('M/D h:mm a');
          });

          // scale the range of the data
          x.domain(data.map(function(d) { return d.Timestamp; }));
          y.domain([0, d3.max(data, function(d) { return d.Average; })]);

          // add axis
          svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis)
                  .selectAll("text")
                  .style("text-anchor", "end")
                  .attr("dx", "-.8em")
                  .attr("dy", "-.55em")
                  .attr("transform", "rotate(-90)" );

          svg.append("g")
                  .attr("class", "y axis")
                  .call(yAxis)
                  .append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 5)
                  .attr("dy", ".71em")
                  .style("text-anchor", "end")

          // Add bar chart
          svg.selectAll("bar")
                  .data(data)
                  .enter().append("rect")
                  .attr("class", "bar")
                  .attr("x", function(d) { return x(d.Timestamp); })
                  .attr("width", x.rangeBand())
                  .attr("y", function(d) { return y(d.Average); })
                  .attr("height", function(d) { return height - y(d.Average); });

          svg.selectAll("text.bar")
                  .data(data)
                  .enter().append("text")
                  .attr("class", "bar")
                  .attr("text-anchor", "middle")
                  .attr("x", function(d) { return x(d.Timestamp) + x.rangeBand()/2; })
                  .attr("y", function(d) { return y(d.Average) - 5; })
                  .text(function(d) { return d.Average.toFixed(2) + "%"; });
      });
  }

}
