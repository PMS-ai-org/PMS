import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientVisualComponent } from './patient-visual-2/patient-visual.component';
import { AppointmentsByClinicSiteComponent } from './appointments-by-clinic-site-2/appointments-by-clinic-site.component';
import { MedicalHistoryHeatmapComponent } from './medical-history-heatmap-2/medical-history-heatmap.component';
import { ClinicSiteAnalyticsDashboardComponent } from './clinic-site-activity-visual-2/clinic-site-analytics-dashboard.component';
import { MaterialModule } from "../../core/shared/material.module";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  imports: [
    CommonModule,
    // done using chatgpt
    PatientVisualComponent,
    AppointmentsByClinicSiteComponent,
    MedicalHistoryHeatmapComponent,
    ClinicSiteAnalyticsDashboardComponent,
    MaterialModule
]
})
export class ReportsComponent {
}
