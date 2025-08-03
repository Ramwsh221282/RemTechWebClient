import { Observable, tap } from 'rxjs';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { inject } from '@angular/core';

export function JwtTokenManagingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const cookiesService: CookieService = inject(CookieService);

  return next(req).pipe(
    tap((event: HttpEvent<unknown>): void => {
      if (!(event instanceof HttpResponse)) return;
      if (event.status !== 200) return;
      if (!req.url.includes('api/users/auth')) return;
      const token: string | null = event.headers.get('Authorization');
      if (!token) return;
      cookiesService.delete('RemTechAccessToken');
      cookiesService.set('RemTechAccessToken', token);
    }),
  );
}
