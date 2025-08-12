import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';

export const appRoutes: Routes = [
  // { path: '', component: HomeComponent },
  { path: 'feature', loadComponent: () => import('./feature/feature.component').then(m => m.FeatureComponent) },
  { path: '**', redirectTo: '' }
];
