import { Routes } from '@angular/router';
import { LoginComponent } from './feature/auth/login/login.component';
//import { RegisterComponent } from './feature/auth/register/register.component';
import { AuthGuard } from './core/auth/auth.guard';
import { CreateDoctorComponent } from './feature/auth/create-doctor.component/create-doctor.component';
import { ResetPasswordComponent } from './feature/auth/reset-password-component/reset-password-component';
import { RoleGuard } from './core/auth/role.guard';
import { HomeComponent } from './feature/home-component/home-component';
import { AppComponent } from './app.component';

export const appRoutes: Routes = [
  { path: '', component: AppComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'createDoctor', component: CreateDoctorComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: 'Admin' } },
  { path: 'todos', canActivate: [AuthGuard], loadComponent: () => import('./feature/todo/todo.component').then(m => m.TodoComponent) },
  { path: 'reset-password', component: ResetPasswordComponent },
  //{ path: '**', redirectTo: '' }
];
