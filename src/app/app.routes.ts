import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'builder',
    loadComponent: () =>
      import('./pages/builder/builder.component').then((m) => m.BuilderComponent),
  },
  {
    path: '',
    redirectTo: 'builder',
    pathMatch: 'full',
  },
];
