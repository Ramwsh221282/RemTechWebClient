import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../../shared/api/api-endpoint';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly _httpClient: HttpClient;
  private readonly _apiUrl: string;

  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
    this._apiUrl = `${apiUrl}/users`;
  }

  public register(
    email: string,
    password: string,
    name: string,
  ): Observable<any> {
    const body = { email: email, password: password, name: name };
    return this._httpClient.post(this._apiUrl, body);
  }
}
