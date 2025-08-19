import { Routes } from '@angular/router';
import { LoginComponent } from './feature/auth/login/login.component';
import { RegisterComponent } from './feature/auth/register/register.component';
import { authGuard } from './core/auth/auth.guard';
import { ReportsDashboardComponent } from './feature/reports-dashboard/reports-dashboard.component';

export const appRoutes: Routes = [  
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'reports', component: ReportsDashboardComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'todos', canActivate: [authGuard], loadComponent: () => import('./feature/todo/todo.component').then(m => m.TodoComponent) },
  { path: '**', redirectTo: '' }
];
