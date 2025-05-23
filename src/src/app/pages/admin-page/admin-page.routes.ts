import { Routes } from '@angular/router';
import { adminAuthGuard } from './admin-page.guard';

export const AdminPageRoutes: Routes = [
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin-page.component').then((c) => c.AdminPageComponent),
    canActivate: [adminAuthGuard],
  },
];
