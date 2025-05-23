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

export type AuthData = {
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
    this.authData = signal(this.createEmptyUserSessionData());
    this.initializeFromCookies(this._cookieService);
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

  public logOut(): void {
    this._cookieService.delete('bearer');
    this._cookieService.delete('refresh');
    this._cookieService.delete('atr');
    this._cookieService.delete('email_verified');
    this._cookieService.delete('jti');
    this._cookieService.delete('nickname');
    this._cookieService.delete('sub');
    this.authData.set(this.createEmptyUserSessionData());
  }

  private isAuthorized(data: AuthData): boolean {
    const bearer = data.bearer;
    const refresh = data.refresh;
    return !(
      StringUtils.isEmptyOrWhiteSpace(bearer) ||
      StringUtils.isEmptyOrWhiteSpace(refresh)
    );
  }

  private initializeFromCookies(cookieService: CookieService): void {
    const cookies = cookieService.getAll();
    const bearer = cookies['bearer'];
    const refresh = cookies['refresh'];
    const atr = cookies['atr'];
    const email_verified = cookies['email_verified'];
    const jti = cookies['jti'];
    const nickname = cookies['nickname'];
    const sub = cookies['sub'];

    const authData: AuthData = {
      bearer: bearer ? bearer : '',
      refresh: refresh ? refresh : '',
      atr: atr ? atr : '',
      email_verified: email_verified ? email_verified : '',
      jti: jti ? jti : '',
      nickname: nickname ? nickname : '',
      sub: sub ? sub : '',
    };

    this.authData.set(authData);
  }

  private createEmptyUserSessionData(): AuthData {
    return {
      bearer: '',
      refresh: '',
      atr: '',
      jti: '',
      sub: '',
      email_verified: '',
      nickname: '',
    };
  }
}
