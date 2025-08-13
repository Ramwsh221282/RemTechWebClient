import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UsersService } from '../../pages/sign-in-page/services/UsersService';
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

export const AdminAccessGuard: CanActivateFn = (route, state) => {
  const usersService: UsersService = inject(UsersService);
  const cookiesService: CookieService = inject(CookieService);
  const router: Router = inject(Router);

  const token: string | undefined = cookiesService.get('RemTechAccessToken');
  const tokenId: string | undefined = cookiesService.get(
    'RemTechAccessTokenId',
  );
  console.log(token, tokenId);
  if (!token || !tokenId) {
    router.navigate(['/sign-in']);
    return false;
  }

  return usersService.verifyAdminAccess(tokenId).pipe(
    map(() => true),
    catchError((err: HttpErrorResponse) => {
      if (err.status === 403) {
        router.navigate(['/forbidden']);
      } else {
        router.navigate(['/sign-in']);
      }
      return of(false);
    }),
  );
};
