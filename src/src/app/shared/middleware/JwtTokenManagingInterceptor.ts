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
      if (
        req.url.includes('sign-in') ||
        req.url.includes('sign-up') ||
        req.url.includes('admin-verify') ||
        req.url.includes('root-up')
      ) {
        const tokenId: string | null = event.headers.get(
          'Authorization_Token_Id',
        );
        const tokenValue: string | null = event.headers.get(
          'Authorization_Token_Value',
        );
        if (!tokenId || !tokenValue) return;
        console.log(tokenId);
        cookiesService.delete('RemTechAccessToken');
        cookiesService.delete('RemTechAccessTokenId');
        cookiesService.set('RemTechAccessToken', tokenValue);
        cookiesService.set('RemTechAccessTokenId', tokenId);
      }
      return;
    }),
  );
}
