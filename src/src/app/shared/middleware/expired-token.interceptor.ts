import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthData, AuthStatusService } from '../services/auth-status.service';
import { AuthResponse } from '../services/auth-response';
import { UsersService } from '../services/users.service';
import { inject } from '@angular/core';
import { Envelope } from '../types/Envelope';
import { Router } from '@angular/router';

export function expiredTokenInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  if (isRefreshCalled(req)) return next(req);

  const authStatusService: AuthStatusService = inject(AuthStatusService);
  const authService: UsersService = inject(UsersService);
  const router: Router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401)
        return handle401Error(
          authStatusService,
          authService,
          req,
          next,
          router,
        );

      return throwError(() => error);
    }),
  );

  function isRefreshCalled(req: HttpRequest<unknown>): boolean {
    return req.url.includes('api/users/refresh');
  }

  function handle401Error(
    authStatusService: AuthStatusService,
    authService: UsersService,
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
    router: Router,
  ): Observable<HttpEvent<unknown>> {
    const data: AuthData = authStatusService.authData();
    const bearer: string = data.bearer;
    const refresh: string = data.refresh;
    const dto: AuthResponse = { accessToken: bearer, refreshToken: refresh };
    return authService.refreshSession(dto).pipe(
      catchError((error: HttpErrorResponse) => {
        authStatusService.logOut();
        router.navigate(['users/authorization']);
        return throwError(() => error);
      }),
      switchMap(
        (envelope: Envelope<AuthResponse>): Observable<HttpEvent<unknown>> => {
          if (envelope.code === 200)
            return onSuccessEnvelope(envelope, authStatusService, req, next);

          router.navigate(['users/authorization']);
          authStatusService.logOut();
          return throwError(() => envelope);
        },
      ),
    );
  }

  function onSuccessEnvelope(
    envelope: Envelope<AuthResponse>,
    authStatusService: AuthStatusService,
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
  ): Observable<HttpEvent<unknown>> {
    return applyRefreshedToken(envelope.data, authStatusService, req, next);
  }

  function applyRefreshedToken(
    response: AuthResponse,
    authStatusService: AuthStatusService,
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
  ): Observable<HttpEvent<unknown>> {
    const bearer: string = response.accessToken;
    const refresh: string = response.refreshToken;
    const headers: HttpHeaders = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + bearer,
    );
    authStatusService.authorize(bearer, refresh);
    return next(req.clone({ headers: headers }));
  }
}
