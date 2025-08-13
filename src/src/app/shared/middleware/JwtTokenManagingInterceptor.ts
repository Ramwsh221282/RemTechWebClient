import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { inject } from '@angular/core';
import { TokensService } from '../services/TokensService';
import { UsersService } from '../../pages/sign-in-page/services/UsersService';

export function JwtTokenManagingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const cookiesService: CookieService = inject(CookieService);
  const tokensService: TokensService = inject(TokensService);
  const usersService: UsersService = inject(UsersService);

  const currentToken: string | null = cookiesService.get(
    'RemTechAccessTokenId',
  );
  const modifiedToken = currentToken
    ? addAuthorizationHeader(req, currentToken)
    : req;

  return next(modifiedToken).pipe(
    tap((event: HttpEvent<unknown>): void => {
      if (!(event instanceof HttpResponse)) return;

      if (event.status === 200) {
        if (req.url.includes('sign-in') || req.url.includes('sign-up')) {
          const tokenId: string | null = event.headers.get(
            'Authorization_Token_Id',
          );
          const tokenValue: string | null = event.headers.get(
            'Authorization_Token_Value',
          );
          updateTokensFromHeaders(
            tokenId,
            tokenValue,
            cookiesService,
            tokensService,
          );
          return;
        }
      }

      if (event.status !== 200) return;

      if (
        req.url.includes('sign-in') ||
        req.url.includes('sign-up') ||
        req.url.includes('admin-verify') ||
        req.url.includes('root-up') ||
        req.url.includes('refresh-session')
      ) {
        const tokenId: string | null = event.headers.get(
          'Authorization_Token_Id',
        );
        const tokenValue: string | null = event.headers.get(
          'Authorization_Token_Value',
        );
        updateTokensFromHeaders(
          tokenId,
          tokenValue,
          cookiesService,
          tokensService,
        );
      }
    }),

    catchError((error: HttpErrorResponse) => {
      if (shouldRefreshToken(error, req)) {
        console.log('handling token refresh');
        return handleTokenRefresh(
          req,
          next,
          cookiesService,
          tokensService,
          usersService,
        );
      }

      return throwError(() => error);
    }),
  );

  function shouldRefreshToken(
    error: HttpErrorResponse,
    req: HttpRequest<unknown>,
  ): boolean {
    if (error.status !== 401 && error.status !== 403) {
      return false;
    }
    if (
      req.url.includes('admin-verify') ||
      req.url.includes('scrapers') ||
      req.url.includes('mailing')
    ) {
      return true;
    }

    return false;
  }
}

function updateTokensFromHeaders(
  tokenId: string | null,
  tokenValue: string | null,
  cookiesService: CookieService,
  tokensService: TokensService,
): void {
  if (tokenId && tokenValue) {
    cookiesService.deleteAll('RemTechAccessToken');
    cookiesService.deleteAll('RemTechAccessTokenId');

    cookiesService.set('RemTechAccessToken', tokenValue);
    cookiesService.set('RemTechAccessTokenId', tokenId);
    tokensService.tokenId.set(tokenId);
  }
}

function addAuthorizationHeader(
  req: HttpRequest<unknown>,
  tokenId: string,
): HttpRequest<unknown> {
  if (!tokenId) return req;

  return req.clone({
    setHeaders: {
      RemTechAccessTokenId: tokenId,
    },
  });
}

function handleTokenRefresh(
  originalReq: HttpRequest<unknown>,
  next: HttpHandlerFn,
  cookiesService: CookieService,
  tokensService: TokensService,
  usersService: UsersService,
): Observable<HttpEvent<unknown>> {
  return usersService.refreshSession().pipe(
    switchMap((refreshResponse: HttpResponse<unknown>) => {
      if (refreshResponse instanceof HttpResponse) {
        const tokenId: string | null = refreshResponse.headers.get(
          'Authorization_Token_Id',
        );
        const tokenValue: string | null = refreshResponse.headers.get(
          'Authorization_Token_Value',
        );
        updateTokensFromHeaders(
          tokenId,
          tokenValue,
          cookiesService,
          tokensService,
        );
        console.log('tokens updated');
      }
      const newTokenId = cookiesService.get('RemTechAccessTokenId');
      const updatedReq = addAuthorizationHeader(originalReq, newTokenId);
      return next(updatedReq);
    }),
    catchError((refreshError) => {
      clearAllTokens(cookiesService, tokensService);
      return throwError(() => refreshError);
    }),
  );
}

function clearAllTokens(
  cookiesService: CookieService,
  tokensService: TokensService,
): void {
  cookiesService.deleteAll('RemTechAccessToken');
  cookiesService.deleteAll('RemTechAccessTokenId');
  tokensService.tokenId.set('');
}
