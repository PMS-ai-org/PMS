import { Component, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-site-geography',
  standalone: true,
  template: `<div class='tile'><h3>Site Geographical Distribution</h3><div id='siteGeography'></div></div>`,
  styleUrls: ['./site-geography.component.scss'],
})
export class SiteGeographyComponent implements AfterViewInit {
  ngAfterViewInit() {
    // Sample data
    const data = [
      { name: 'Site A', lat: 19.076, lon: 72.877 },
      { name: 'Site B', lat: 28.704, lon: 77.102 },
      { name: 'Site C', lat: 13.082, lon: 80.270 },
      { name: 'Site D', lat: 22.572, lon: 88.363 },
    ];
    const width = 350, height = 250;
    const svg = d3.select('#siteGeography')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    const x = d3.scaleLinear()
      .domain([13, 29])
      .range([40, width - 40]);
    const y = d3.scaleLinear()
      .domain([72, 89])
      .range([height - 40, 40]);
    svg.selectAll('circle')
      .data(data)
      .enter().append('circle')
      .attr('cx', d => x(d.lat))
      .attr('cy', d => y(d.lon))
      .attr('r', 12)
      .attr('fill', '#43dde6')
      .attr('opacity', 0.8)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('fill', '#f6c90e');
      })
      .on('mouseout', function (event, d) {
        d3.select(this).attr('fill', '#43dde6');
      });
    svg.selectAll('text')
      .data(data)
      .enter().append('text')
      .attr('x', d => x(d.lat))
      .attr('y', d => y(d.lon) - 18)
      .text(d => d.name)
      .attr('text-anchor', 'middle')
      .style('font-size', '13px')
      .style('fill', '#333');
  }
}
