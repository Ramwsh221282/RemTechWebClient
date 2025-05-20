import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { usersServiceApiUrl } from '../api/api-endpoint';
import { UserRegisterDto } from './user-register-dto';
import { Observable } from 'rxjs';
import { Envelope } from '../types/Envelope';
import { UserConfirmEmailDto } from './user-confirm-email-dto';
import { AuthDto } from './auth-dto';
import { AuthResponse } from './auth-response';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly _httpClient: HttpClient;
  private readonly _apiUrl: string;

  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
    this._apiUrl = `${usersServiceApiUrl}`;
  }

  public registerUser(dto: UserRegisterDto): Observable<Envelope<string>> {
    const url = `${this._apiUrl}/users/registration`
    return this._httpClient.post<Envelope<string>>(url, dto);
  }

  public confirmEmail(dto: UserConfirmEmailDto): Observable<Envelope<string>> {
    const url = `${this._apiUrl}/users/email-confirmation`
    return this._httpClient.put<Envelope<string>>(url, dto);
  }

  public auth(dto: AuthDto): Observable<Envelope<AuthResponse>> {
    const url = `${this._apiUrl}/users/authorization`;
    return this._httpClient.post<Envelope<AuthResponse>>(url, dto);
  }

  public refreshSession(dto: AuthResponse): Observable<Envelope<AuthResponse>> {
    const accessToken = dto.accessToken;
    const refreshToken = dto.refreshToken;

    const headers = new HttpHeaders()
      .set("Bearer", accessToken)
      .set("Refresh", refreshToken);

    const url = `${this._apiUrl}/users/refresh`;
    return this._httpClient.post<Envelope<AuthResponse>>(url, null, { headers: headers });
  }
}
