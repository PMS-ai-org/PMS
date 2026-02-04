import { Component, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-doctor-specialties',
  standalone: true,
  template: `<div class='tile'><h3>Doctor Specialties</h3><div id='doctorSpecialties'></div></div>`,
  styleUrls: ['./doctor-specialties.component.scss'],
})
export class DoctorSpecialtiesComponent implements AfterViewInit {
  ngAfterViewInit() {
    // Sample data
    const data = [
      { specialty: 'Cardiology', count: 10 },
      { specialty: 'Dermatology', count: 7 },
      { specialty: 'Pediatrics', count: 12 },
      { specialty: 'Orthopedics', count: 5 },
    ];
    const width = 350, height = 250, radius = Math.min(width, height) / 2 - 30;
    const svg = d3.select('#doctorSpecialties')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);
    const pie = d3.pie<any>().value(d => d.count);
    const arc = d3.arc<any>().innerRadius(40).outerRadius(radius);
    const color = d3.scaleOrdinal(d3.schemeSet2);
    svg.selectAll('path')
      .data(pie(data))
      .enter().append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(i.toString()))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', function (event, d) {
        d3.select(this).attr('fill', '#f6c90e');
      })
      .on('mouseout', function (event, d) {
        d3.select(this).attr('fill', color((d.index ?? 0).toString()));
      });
    svg.selectAll('text')
      .data(pie(data))
      .enter().append('text')
      .text(d => d.data.specialty)
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', '13px');
  }
}
