import { Routes } from '@angular/router';

export const MainPageRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./main-page.component').then((c) => c.MainPageComponent),
  },
];
