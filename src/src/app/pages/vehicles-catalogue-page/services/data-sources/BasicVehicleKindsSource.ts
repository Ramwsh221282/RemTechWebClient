import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BasicVehicleKind } from '../../types/BasicVehicleKind';
import { apiUrl } from '../../../../shared/api/api-endpoint';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BasicVehicleKindsSource {
  private readonly _httpClient: HttpClient;
  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
  }
  public fetch(): Observable<BasicVehicleKind[]> {
    const requestUrl = `${apiUrl}/kinds`;
    return this._httpClient.get<BasicVehicleKind[]>(requestUrl);
  }
}
