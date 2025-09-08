/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ReportsUiService } from '../reports-ui.service';
import { Appointment } from '../../../models/appointment.model';
import { Clinic } from '../../../models/clinic.model';
import { Site } from '../../../models/site.model';
import { Observable, combineLatest, map } from 'rxjs';
import * as echarts from 'echarts/core';
import { ScatterChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CanvasRenderer
]);

@Component({
  selector: 'app-appointments-by-clinic-site',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective],
  templateUrl: './appointments-by-clinic-site.component.html',
  styleUrls: ['./appointments-by-clinic-site.component.scss'],
})
export class AppointmentsByClinicSiteComponent {
  options$: Observable<any>;
  treatmentStackedBarOptions$: Observable<any>;

  constructor(private reportsUiService: ReportsUiService) {
    // Scatter plot tile
    this.options$ = combineLatest([
      this.reportsUiService.getAppointments(),
      this.reportsUiService.getClinics(),
      this.reportsUiService.getSites()
    ]).pipe(
      map(([appointments, clinics, sites]: [Appointment[], Clinic[], Site[]]) => {
        const clinicMap = new Map(clinics.map(c => [c.id, c.name]));
        const siteMap = new Map(sites.map(s => [s.id, s.name]));
        const statuses = Array.from(new Set(appointments.map(a => a.status || 'unknown')));
        const statusColorMap: Record<string, string> = {};
        const palette = ['#3b82f6', '#f59e42', '#10b981', '#ef4444', '#a855f7', '#fbbf24', '#6366f1', '#14b8a6'];
        statuses.forEach((status, i) => statusColorMap[status] = palette[i % palette.length]);
        const dowLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const series = statuses.map(status => {
          const data = appointments.filter(a => (a.status || 'unknown') === status && a.lead_time_hours != null && a.dow != null)
            .map(a => {
              return {
                value: [a.lead_time_hours, a.dow],
                appointment: a,
                clinic: clinicMap.get(a.clinic_id || '') || '',
                site: siteMap.get(a.site_id || '') || ''
              };
            });
          return {
            name: status,
            type: 'scatter',
            data,
            symbolSize: 14,
            itemStyle: { color: statusColorMap[status] },
            emphasis: { focus: 'series' }
          };
        });
        return {
          title: {
            text: 'Appointment Lead Time vs Day of Week',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
              const a = params.data.appointment;
              return `<b>Patient:</b> ${a.patient_id || ''}<br/>
                <b>Clinic:</b> ${params.data.clinic}<br/>
                <b>Site:</b> ${params.data.site}<br/>
                <b>Status:</b> ${a.status}<br/>
                <b>Lead Time (hrs):</b> ${a.lead_time_hours}<br/>
                <b>Day of Week:</b> ${dowLabels[a.dow] || a.dow}`;
            }
          },
          legend: {
            data: statuses,
            top: 40
          },
          grid: { left: 60, right: 40, bottom: 60, top: 80 },
          xAxis: {
            name: 'Lead Time (hours)',
            type: 'value',
            min: 0
          },
          yAxis: {
            name: 'Day of Week',
            type: 'category',
            data: dowLabels,
            axisLabel: { formatter: (value: any) => dowLabels[value] || value }
          },
          series
        };
      })
    );

    // Stacked bar chart for treatment plan (diagnosis)
    this.treatmentStackedBarOptions$ = this.reportsUiService.getAppointments().pipe(
      map((appointments: Appointment[]) => {
        // Parse treatment_plan JSON and collect all diagnosis values
        const treatmentTypes = new Set<string>();
        const statusSet = new Set<string>();
        const dataMap: Record<string, Record<string, number>> = {};
        for (const appt of appointments) {
          let diagnosis = 'Unknown';
          if (appt.treatment_plan) {
            try {
              const plan = JSON.parse(appt.treatment_plan);
              if (plan.diagnosis) diagnosis = plan.diagnosis;
            } catch {}
          }
          treatmentTypes.add(diagnosis);
          const status = appt.status || 'unknown';
          statusSet.add(status);
          if (!dataMap[status]) dataMap[status] = {};
          dataMap[status][diagnosis] = (dataMap[status][diagnosis] || 0) + 1;
        }
        const treatmentArr = Array.from(treatmentTypes);
        const statusArr = Array.from(statusSet);
        const palette = ['#3b82f6', '#f59e42', '#10b981', '#ef4444', '#a855f7', '#fbbf24', '#6366f1', '#14b8a6'];
        const series = statusArr.map((status, i) => ({
          name: status,
          type: 'bar',
          stack: 'total',
          emphasis: { focus: 'series' },
          itemStyle: { color: palette[i % palette.length] },
          data: treatmentArr.map(t => dataMap[status][t] || 0)
        }));
        return {
          title: {
            text: 'Appointments by Treatment Type and Status',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
          },
          legend: {
            data: statusArr,
            top: 40
          },
          grid: { left: 60, right: 40, bottom: 60, top: 80 },
          xAxis: {
            type: 'category',
            data: treatmentArr,
            name: 'Treatment Type',
            axisLabel: { rotate: 30 }
          },
          yAxis: {
            type: 'value',
            name: 'Appointments'
          },
          series
        };
      })
    );
  }
}
