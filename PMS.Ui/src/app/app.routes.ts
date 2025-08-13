import { Routes } from '@angular/router';
import { LoginComponent } from './feature/auth/login/login.component';
import { RegisterComponent } from './feature/auth/register/register.component';
import { authGuard } from './core/auth/auth.guard';

export const appRoutes: Routes = [  
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'todos', canActivate: [authGuard], loadComponent: () => import('./feature/todo/todo.component').then(m => m.TodoComponent) },
  { path: '**', redirectTo: '' }
];
