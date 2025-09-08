// tslint:disable
// eslint-disable
import { Component, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

interface ClinicData {
  clinic: string;
  appointments: number;
}

@Component({
  selector: 'app-appointments-by-clinic',
  standalone: true,
  template: `<div class='tile'><h3>Appointments by Clinic</h3><div id='appointmentsByClinic'></div></div>`,
  styleUrls: ['./appointments-by-clinic.component.scss'],
})
export class AppointmentsByClinicComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // Sample data
    const data: ClinicData[] = [
      { clinic: 'Clinic A', appointments: 120 },
      { clinic: 'Clinic B', appointments: 80 },
      { clinic: 'Clinic C', appointments: 150 },
      { clinic: 'Clinic D', appointments: 60 },
    ];
    const width = 350, height = 250, margin = { top: 30, right: 20, bottom: 40, left: 50 };
    // @ts-ignore
    const container = d3.select('#appointmentsByClinic');
    // @ts-ignore
    const svg = container.append('svg')
      .attr('width', width)
      .attr('height', height);
    const x = d3.scaleBand()
      .domain(data.map(d => d.clinic))
      .range([margin.left, width - margin.right])
      .padding(0.2);
  const maxAppointments = d3.max(data, (d: ClinicData) => d.appointments) ?? 0;
    const y = d3.scaleLinear()
      .domain([0, maxAppointments]).nice()
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
      .attr('x', (d: ClinicData) => x(d.clinic) ?? 0)
      .attr('y', (d: ClinicData) => y(d.appointments))
      .attr('width', x.bandwidth())
      .attr('height', (d: ClinicData) => y(0) - y(d.appointments))
      .attr('fill', '#4f8a8b')
      .on('mouseover', function (event: MouseEvent, d: ClinicData) {
        d3.select(this as SVGRectElement).attr('fill', '#f6c90e');
      })
      .on('mouseout', function (event: MouseEvent, d: ClinicData) {
        d3.select(this as SVGRectElement).attr('fill', '#4f8a8b');
      });
  }
}
