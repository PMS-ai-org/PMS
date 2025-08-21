/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Component, OnInit } from '@angular/core';
import { NgxEchartsDirective, NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components';
import { BarChart, PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { CommonModule } from '@angular/common';
import { ReportsUiService } from '../reports-ui.service';
import { Patient } from '../../../models/patient.model';
import { Observable } from 'rxjs';

// Register echarts modules
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  BarChart,
  PieChart,
  CanvasRenderer
]);

@Component({
  selector: 'app-patient-visual',
  standalone: true,
  imports: [NgxEchartsModule, NgxEchartsDirective, CommonModule],
  templateUrl: './patient-visual.component.html',
  styleUrls: ['./patient-visual.component.scss']
})
export class PatientVisualComponent implements OnInit {
  patients$!: Observable<Patient[]>;

  ageOptions: echarts.EChartsCoreOption = {};
  genderOptions: echarts.EChartsCoreOption = {};
  conditionsOptions: echarts.EChartsCoreOption = {};

  constructor(private reportsUiService: ReportsUiService) {}

  ngOnInit(): void {
    this.patients$ = this.reportsUiService.getPatients();

    this.patients$.subscribe(patients => {
      if (!patients || patients.length === 0) return;

      this.buildAgeChart(patients);
      this.buildGenderChart(patients);
      this.buildConditionsChart(patients);
    });
  }

  private buildAgeChart(patients: Patient[]) {
    const ageGroups: { [key: string]: number } = {};
    patients.forEach(p => {
      const group = (p.age as number) < 18 ? '0-17' :
                    (p.age as number) < 30 ? '18-29' :
                    (p.age as number) < 45 ? '30-44' :
                    (p.age as number) < 60 ? '45-59' : '60+';
      ageGroups[group] = (ageGroups[group] || 0) + 1;
    });

    this.ageOptions = {
      title: { text: 'Age Distribution' },
      tooltip: {},
      xAxis: { type: 'category', data: Object.keys(ageGroups) },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'bar',
          data: Object.values(ageGroups),
          itemStyle: { color: '#3b82f6' }
        }
      ]
    };
  }

  private buildGenderChart(patients: Patient[]) {
    const genders: { [key: string]: number } = {};
    patients.forEach(p => {
      genders[p.gender as string] = (genders[p.gender as string] || 0) + 1;
    });

    this.genderOptions = {
      title: { text: 'Gender Ratio', left: 'center' },
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [
        {
          name: 'Gender',
          type: 'pie',
          radius: '60%',
          data: Object.entries(genders).map(([name, value]) => ({ name, value }))
        }
      ]
    };
  }

  private buildConditionsChart(patients: Patient[]) {
    const conditions: { [key: string]: number } = {};
    patients.forEach(p => {
      (p.conditions || []).forEach(c => {
        conditions[c] = (conditions[c] || 0) + 1;
      });
    });

    this.conditionsOptions = {
      title: { text: 'Top Conditions' },
      tooltip: {},
      xAxis: { type: 'category', data: Object.keys(conditions) },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'bar',
          data: Object.values(conditions),
          itemStyle: { color: '#10b981' }
        }
      ]
    };
  }
}
