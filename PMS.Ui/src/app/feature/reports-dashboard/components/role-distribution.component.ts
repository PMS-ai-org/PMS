import { Component, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-role-distribution',
  standalone: true,
  template: `<div class='tile'><h3>User Role Distribution</h3><div id='roleDistribution'></div></div>`,
  styleUrls: ['./role-distribution.component.scss'],
})
export class RoleDistributionComponent implements AfterViewInit {
  ngAfterViewInit() {
    // Sample data
    const data = [
      { role: 'Admin', count: 3 },
      { role: 'Doctor', count: 15 },
      { role: 'Receptionist', count: 5 },
      { role: 'Patient', count: 60 },
    ];
    const width = 350, height = 250, margin = { top: 30, right: 20, bottom: 40, left: 50 };
    const svg = d3.select('#roleDistribution')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    const x = d3.scaleBand()
      .domain(data.map(d => d.role))
      .range([margin.left, width - margin.right])
      .padding(0.2);
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count)!]).nice()
      .range([height - margin.bottom, margin.top]);
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
    svg.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.role)!)
      .attr('y', d => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', d => y(0) - y(d.count))
      .attr('fill', '#f67280')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('fill', '#355c7d');
      })
      .on('mouseout', function (event, d) {
        d3.select(this).attr('fill', '#f67280');
      });
  }
}
