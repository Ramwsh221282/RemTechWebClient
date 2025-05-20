import { Routes } from '@angular/router';

export const UserAuthRoutes: Routes = [
  {
    path: 'users/authorization',
    loadComponent: () =>
      import('./user-auth-page.component')
      .then((c) => c.UserAuthPageComponent)
  },
]
