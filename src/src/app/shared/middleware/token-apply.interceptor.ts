import { HttpHandlerFn, HttpHeaders, HttpRequest } from '@angular/common/http';
import { AuthStatusService } from '../services/auth-status.service';
import { inject } from '@angular/core';

export function tokenApplyInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  if (req.url.includes('api/users/refresh')) return next(req);

  const authStatusService: AuthStatusService = inject(AuthStatusService);
  const data = authStatusService.authData();
  const bearer = data.bearer;
  const refresh = data.refresh;

  const headers: HttpHeaders = new HttpHeaders()
    .set('Authorization', 'Bearer ' + bearer)
    .set('Refresh', refresh);

  return next(req.clone({ headers: headers }));
}
