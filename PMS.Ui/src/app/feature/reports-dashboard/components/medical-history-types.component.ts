import { Component, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-medical-history-types',
  standalone: true,
  template: `<div class='tile'><h3>Medical History Types</h3><div id='medicalHistoryTypes'></div></div>`,
  styleUrls: ['./medical-history-types.component.scss'],
})
export class MedicalHistoryTypesComponent implements AfterViewInit {
  ngAfterViewInit() {
    // Sample data
    const data = [
      { type: 'Diabetes', count: 20 },
      { type: 'Hypertension', count: 15 },
      { type: 'Asthma', count: 10 },
      { type: 'Allergy', count: 5 },
    ];
    const width = 350, height = 250, radius = Math.min(width, height) / 2 - 30;
    const svg = d3.select('#medicalHistoryTypes')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);
    const pie = d3.pie<any>().value(d => d.count);
    const arc = d3.arc<any>().innerRadius(60).outerRadius(radius);
    const color = d3.scaleOrdinal(d3.schemeSet3);
    svg.selectAll('path')
      .data(pie(data))
      .enter().append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i.toString()))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('fill', '#4f8a8b');
      })
      .on('mouseout', function (event, d) {
        d3.select(this).attr('fill', color((d.index ?? 0).toString()));
      });
    svg.selectAll('text')
      .data(pie(data))
      .enter().append('text')
      .text(d => d.data.type)
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', '13px');
  }
}
