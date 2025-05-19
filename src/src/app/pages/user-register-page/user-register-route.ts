import { Routes } from '@angular/router';

export const UserRegisterRoutes: Routes = [
  {
    path: 'users/registration',
    loadComponent: () => import('./user-register-page.component')
      .then((c) => c.UserRegisterPageComponent),
  },
]
