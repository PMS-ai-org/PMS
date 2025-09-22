import { Routes } from '@angular/router';
import { LoginComponent } from './feature/auth/login/login.component';
import { AuthGuard } from './core/auth/auth.guard';
import { CreateDoctorComponent } from './feature/auth/create-doctor.component/create-doctor.component';
import { ResetPasswordComponent } from './feature/auth/reset-password-component/reset-password-component';
import { RoleGuard } from './core/auth/role.guard';
import { HomeComponent } from './feature/home-component/home-component';
import { AppComponent } from './app.component';
import { EditAccess } from './feature/auth/edit-access/edit-access.component';
import { AppointmentComponent } from './feature/appointment/appointment.component';
import { MedicalHistoryComponent } from './feature/medical-history/medical-history.component';
import { PatientProfileComponent } from './feature/patient-profile/patient-profile.component';
import { PatientRegistrationComponent } from './feature/patient-registration/patient-registration.component';
import { ReportsComponent } from './feature/reports/reports.component';
import { SearchPatientComponent } from './feature/patient-search/search-patient/search-patient.component';
import { MedicalHistoryFormComponent } from './feature/medical-history/components/form/medical-history-form.component';

export const appRoutes: Routes = [
  { path: '', component: AppComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'create-staff', component: CreateDoctorComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: 'Admin' } },
  { path: 'patient/profile/:id', component: PatientProfileComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['Admin', 'Staff', 'Doctor'] } },
  { path: 'patient/register', component: PatientRegistrationComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['Admin', 'Staff', 'Doctor'] } },
  { path: 'patient/register/:id', component: PatientRegistrationComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['Admin', 'Staff', 'Doctor'] } },
  { path: 'patient/search', component: SearchPatientComponent},
  { path: 'appointment', component: AppointmentComponent, data: { roles: ['Admin', 'Staff', 'Doctor'] } },
  { path: 'medical-history/add', component: MedicalHistoryFormComponent, data: { roles: ['Doctor', 'Admin'] } },
  { path: 'medical-history/edit/:id', component: MedicalHistoryFormComponent, data: { roles: ['Doctor', 'Admin'] } },
  { path: 'medical-history/:patientId', component: MedicalHistoryComponent, data: { roles: ['Doctor', 'Admin'] } },
  { path: 'permissions', component: EditAccess, canActivate: [AuthGuard, RoleGuard], data: { roles: 'Admin' } },
  { path: 'reports', component: ReportsComponent, data: { roles: ['Staff', 'Doctor', 'Admin'] } },
  { path: 'reset-password', component: ResetPasswordComponent },
];
