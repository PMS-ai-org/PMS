/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective } from 'ngx-echarts';
import { ReportsUiService } from '../reports-ui.service';
import { Appointment } from '../../../models/appointment.model';
import { Observable, map } from 'rxjs';
import * as echarts from 'echarts/core';
import {
  BarChart
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Register only what we need
echarts.use([
  BarChart,
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

  constructor(private reportsUiService: ReportsUiService) {
    this.options$ = this.reportsUiService.getAppointments().pipe(
      map((appointments: Appointment[]) => {
        const counts: Record<string, number> = {};
        for (const appt of appointments) {
          const key = appt.clinicId || appt.siteId || 'Unknown';
          counts[key] = (counts[key] || 0) + 1;
        }

        return {
          title: {
            text: 'Appointments by Clinic/Site',
            left: 'center'
          },
          tooltip: { trigger: 'axis' },
          legend: { bottom: 0 },
          xAxis: {
            type: 'category',
            data: Object.keys(counts)
          },
          yAxis: { type: 'value' },
          series: [
            {
              name: 'Appointments',
              type: 'bar',
              data: Object.values(counts),
              itemStyle: { color: '#3b82f6' }
            }
          ]
        };
      })
    );
  }
}
