import {Routes} from '@angular/router';

export const AdminPageRoutes: Routes =
  [
    {
      path: 'admin',
      loadComponent: () =>
        import('./admin-page.component').then(
          (c) => c.AdminPageComponent
        ),
    },
  ]
