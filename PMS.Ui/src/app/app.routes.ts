import { Routes } from '@angular/router';
import { LoginComponent } from './feature/auth/login/login.component';
//import { RegisterComponent } from './feature/auth/register/register.component';
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

export const appRoutes: Routes = [
  { path: '', component: AppComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'createDoctor', component: CreateDoctorComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: 'Admin' } },
 { path: 'patient/profile/:id', component: PatientProfileComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: 'Admin,Doctor' }   },
  { path: 'patient/register', component: PatientRegistrationComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: 'Admin' } },
  { path: 'appointment/:patientId', component: AppointmentComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: 'Admin' } },
  { path: 'medical-history/:patientId', component: MedicalHistoryComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: 'Admin, Doctor' } },
  { path: 'editAccess', component: EditAccess, canActivate: [AuthGuard, RoleGuard], data: { roles: 'Admin' } },
  { path: 'todos', canActivate: [AuthGuard], loadComponent: () => import('./feature/todo/todo.component').then(m => m.TodoComponent) },
  { path: 'reset-password', component: ResetPasswordComponent },

  //{ path: '**', redirectTo: '' }
  //  { path: '', redirectTo: '/patient/register', pathMatch: 'full' }
];
