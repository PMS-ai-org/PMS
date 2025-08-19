import { Component, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-patient-growth',
  standalone: true,
  template: `<div class='tile'><h3>Patient Growth Over Time</h3><div id='patientGrowth'></div></div>`,
  styleUrls: ['./patient-growth.component.scss'],
})
export class PatientGrowthComponent implements AfterViewInit {
  ngAfterViewInit() {
    // Sample data
    const data = [
      { month: 'Jan', patients: 30 },
      { month: 'Feb', patients: 45 },
      { month: 'Mar', patients: 60 },
      { month: 'Apr', patients: 80 },
      { month: 'May', patients: 100 },
      { month: 'Jun', patients: 120 },
    ];
    const width = 350, height = 250, margin = { top: 30, right: 20, bottom: 40, left: 50 };
    const svg = d3.select('#patientGrowth')
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    const x = d3.scalePoint()
      .domain(data.map(d => d.month))
      .range([margin.left, width - margin.right]);
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.patients)!]).nice()
      .range([height - margin.bottom, margin.top]);
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
    const line = d3.line<any>()
      .x(d => x(d.month)!)
      .y(d => y(d.patients));
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#4f8a8b')
      .attr('stroke-width', 3)
      .attr('d', line);
    svg.selectAll('circle')
      .data(data)
      .enter().append('circle')
      .attr('cx', d => x(d.month)!)
      .attr('cy', d => y(d.patients))
      .attr('r', 5)
      .attr('fill', '#f6c90e')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('fill', '#4f8a8b');
      })
      .on('mouseout', function (event, d) {
        d3.select(this).attr('fill', '#f6c90e');
      });
  }
}
