import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'builder',
    loadComponent: () =>
      import('./pages/builder/builder.component').then(
        (m) => m.BuilderComponent,
      ),
  },
  {
    path: '',
    redirectTo: 'builder',
    pathMatch: 'full',
  },
  {
    path: 'guide',
    loadComponent: () =>
      import('./pages/guide/guide.component').then((m) => m.GuideComponent),
  },
];
