import { inject } from '@angular/core';
import {
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthStatusService } from '../services/auth-status.service';
import { Envelope } from '../types/Envelope';
import { AuthResponse } from '../services/auth-response';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  if (!isAuthRequest(req)) return next(req);

  const authService: AuthStatusService = inject(AuthStatusService);

  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) {
        if (event.status !== 200) return;
        const body = event.body;

        if (!isEnvelope(body)) return;
        const envelope = body as Envelope<any>;

        if (!isAuthEnvelope(envelope)) return;
        if (envelope.code !== 200) return;

        const authEnvelope = envelope as Envelope<AuthResponse>;

        const bearer = authEnvelope.data.accessToken;
        const refresh = authEnvelope.data.refreshToken;
        authService.authorize(bearer, refresh);
      }
    }),
  );
}

function isEnvelope(body: any): boolean {
  return (
    body &&
    typeof body === 'object' &&
    'data' in body &&
    'code' in body &&
    'statusInfo' in body
  );
}

function isAuthEnvelope(envelope: Envelope<any>): boolean {
  const data = envelope.data;
  const accessToken = data.accessToken;
  const refreshToken = data.refreshToken;
  return accessToken && refreshToken;
}

function isAuthRequest(req: HttpRequest<any>) {
  return req.url.includes('api/users/authorization');
}
