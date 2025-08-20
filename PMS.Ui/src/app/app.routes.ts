import { Routes } from '@angular/router';
import { LoginComponent } from './feature/auth/login/login.component';
//import { RegisterComponent } from './feature/auth/register/register.component';
import { AuthGuard } from './core/auth/auth.guard';
import { CreateDoctorComponent } from './feature/auth/create-doctor.component/create-doctor.component';
import { ResetPasswordComponent } from './feature/auth/reset-password-component/reset-password-component';
import { RoleGuard } from './core/auth/role.guard';
import { HomeComponent } from './feature/home-component/home-component';
import { AppComponent } from './app.component';
import { MedicalHistoryListComponent } from './feature/medical-history/components/list/medical-history-list.component';
import { MedicalHistoryFormComponent } from './feature/medical-history/components/form/medical-history-form.component';

export const appRoutes: Routes = [
  { path: '', component: AppComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'createDoctor', component: CreateDoctorComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: 'Admin' } },
  { path: 'addMedicalHistory', component: MedicalHistoryFormComponent },
  { path: 'medicalHistoryList', component: MedicalHistoryListComponent },
  { path: 'medical-history/add', component: MedicalHistoryFormComponent },
  { path: 'medical-history/edit/:id', component: MedicalHistoryFormComponent },

  { path: 'todos', canActivate: [AuthGuard], loadComponent: () => import('./feature/todo/todo.component').then(m => m.TodoComponent) },
  { path: 'reset-password', component: ResetPasswordComponent },
  //{ path: '**', redirectTo: '' }
];
