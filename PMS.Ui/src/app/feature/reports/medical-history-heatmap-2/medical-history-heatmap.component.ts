/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { ReportsUiService } from '../reports-ui.service';
import { MedicalHistory } from '../../../models/medical-history.model';
import { EChartsOption } from 'echarts';

// 👇 Import echarts core
import * as echarts from 'echarts/core';

// 👇 Import chart type + components + renderer you need
import { HeatmapChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  CalendarComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { PatientAutocompleteComponent } from '../../patient-autocomplete/patient-autocomplete.component';

// 👇 Register them locally
echarts.use([
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  CalendarComponent,
  HeatmapChart,
  CanvasRenderer
]);

@Component({
  selector: 'app-medical-history-heatmap',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule, PatientAutocompleteComponent],
  templateUrl: './medical-history-heatmap.component.html',
  styleUrls: ['./medical-history-heatmap.component.scss']
})
export class MedicalHistoryHeatmapComponent implements OnInit {
  private reportsUiService = inject(ReportsUiService);
  medicalHistory: MedicalHistory[] = [];
  chartOptions!: EChartsOption;
  patientId: any;

  ngOnInit(): void {
    this.reportsUiService.getAllMedicalHistory().subscribe(history => {
      this.medicalHistory = history;
      this.prepareChartOptions();
    });
  }

  onPatientSelected(patient: any) {
    const patientId = patient?.id || patient;
    this.patientId = patientId;
    this.reportsUiService.getMedicalHistory(patientId).subscribe(history => {
      this.medicalHistory = history;
      this.prepareChartOptions();
    });
  }

  private prepareChartOptions(): void {
    const countsMap: Record<string, number> = {};

    this.medicalHistory.forEach(item => {
      const dateObj: Date = item.created_at 
        ? new Date(item.created_at) // convert string -> Date
        : new Date();

      const date = dateObj.toISOString().split('T')[0]; // yyyy-MM-dd
      countsMap[date] = (countsMap[date] || 0) + 1;
    });

    const data: [string, number][] = Object.entries(countsMap).sort(
      (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
    );

    const max = Math.max(...data.map(d => d[1]), 1);

    this.chartOptions = {
      title: { text: 'Medical History Activity Heatmap', left: 'center' },
      tooltip: {
        position: 'top',
        formatter: (p: any) => `${p.value[0]}: ${p.value[1]} records`
      },
      visualMap: {
        min: 0,
        max,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        top: 250,
        inRange: { color: ['#e0f2fe', '#0284c7'] }
      },
      calendar: {
        range: new Date().getFullYear().toString(),
        cellSize: ['auto', 20],
        splitLine: { show: false },
        dayLabel: { firstDay: 1, nameMap: 'en' },
        monthLabel: { nameMap: 'en' }
      },
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data
      }
    };
  }
}
