import { Routes } from '@angular/router';

export const SignInPageRoutes: Routes = [
  {
    path: 'sign-in',
    loadComponent: () =>
      import('./sign-in-page.component').then((c) => c.SignInPageComponent),
  },
];
