import { CanActivateFn, Router } from '@angular/router';
import { AuthStatusService } from '../../shared/services/auth-status.service';
import { inject } from '@angular/core';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const authStatusService: AuthStatusService = inject(AuthStatusService);
  const authData = authStatusService.authData();

  if (authData.atr.includes('ADMIN')) return true;

  router.navigate(['forbidden']);
  return false;
};
