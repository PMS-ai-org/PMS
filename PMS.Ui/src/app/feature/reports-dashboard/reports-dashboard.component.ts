import { Component } from '@angular/core';
import { AppointmentsByClinicComponent } from './components/appointments-by-clinic.component';
import { DoctorSpecialtiesComponent } from './components/doctor-specialties.component';
import { PatientGrowthComponent } from './components/patient-growth.component';
import { MedicalHistoryTypesComponent } from './components/medical-history-types.component';
import { RoleDistributionComponent } from './components/role-distribution.component';
import { SiteGeographyComponent } from './components/site-geography.component';

@Component({
  selector: 'app-reports-dashboard',
  standalone: true,
  templateUrl: './reports-dashboard.component.html',
  styleUrls: ['./reports-dashboard.component.scss'],
  imports: [
    AppointmentsByClinicComponent,
    DoctorSpecialtiesComponent,
    PatientGrowthComponent,
    MedicalHistoryTypesComponent,
    RoleDistributionComponent,
    SiteGeographyComponent,
  ],
})
export class ReportsDashboardComponent {}
