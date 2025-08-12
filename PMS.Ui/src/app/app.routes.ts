import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  // { path: '', component: HomeComponent },
  { path: 'todos', loadComponent: () => import('./feature/todo/todo.component').then(m => m.TodoComponent) },
  { path: '**', redirectTo: '' }
];
