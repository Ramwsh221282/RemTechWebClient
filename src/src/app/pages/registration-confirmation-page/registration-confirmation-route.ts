import { Routes } from '@angular/router';
import { RootExistsGuard } from '../../shared/guards/RootExistsGuard';
import { MailingSendersExistGuard } from '../../shared/guards/MailingSendersExistGuard';

export const RegistrationConfirmationRoute: Routes = [
  {
    path: 'email-confirmation',
    loadComponent: () =>
      import('./registration-confirmation-page.component').then(
        (c) => c.RegistrationConfirmationPageComponent,
      ),
    canActivate: [],
  },
];
