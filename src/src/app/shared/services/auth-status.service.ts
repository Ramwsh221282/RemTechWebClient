import {
  computed,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { StringUtils } from '../utils/string-utils';
import { jwtDecode } from 'jwt-decode';

type AuthData = {
  bearer: string;
  refresh: string;
  atr: string; // user roles
  email_verified: string;
  jti: string; // token id
  nickname: string;
  sub: string; // user id
};

@Injectable({
  providedIn: 'root',
})
export class AuthStatusService {
  private readonly _cookieService: CookieService;

  readonly authData: WritableSignal<AuthData>;

  readonly isUserLoggedIn: Signal<boolean> = computed(() => {
    const authData = this.authData();
    return this.isAuthorized(authData);
  });

  constructor(cookieService: CookieService) {
    this._cookieService = cookieService;
    this.authData = signal({
      bearer: '',
      refresh: '',
      atr: '',
      jti: '',
      sub: '',
      email_verified: '',
      nickname: '',
    });
  }

  public authorize(bearer: string, refresh: string): void {
    const data = jwtDecode<{
      atr: string;
      email_verified: string;
      jti: string;
      nickname: string;
      sub: string;
    }>(bearer);

    const atr = data.atr;
    const email_verified = data.email_verified;
    const jti = data.jti;
    const nickname = data.nickname;
    const sub = data.sub;

    this._cookieService.set('bearer', bearer);
    this._cookieService.set('refresh', refresh);
    this._cookieService.set('atr', atr);
    this._cookieService.set('email_verified', email_verified);
    this._cookieService.set('jti', jti);
    this._cookieService.set('nickname', nickname);
    this._cookieService.set('sub', sub);

    const authData: AuthData = {
      bearer: bearer,
      refresh: refresh,
      atr: atr,
      email_verified: email_verified,
      sub: sub,
      jti: jti,
      nickname: nickname,
    };

    this.authData.set(authData);
  }

  private isAuthorized(data: AuthData): boolean {
    const bearer = data.bearer;
    const refresh = data.refresh;
    return !(
      StringUtils.isEmptyOrWhiteSpace(bearer) ||
      StringUtils.isEmptyOrWhiteSpace(refresh)
    );
  }
}
