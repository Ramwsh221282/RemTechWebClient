import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../../../shared/api/api-endpoint';
import { Observable } from 'rxjs';
import { VehicleKindSource } from './vehiclekindssource';
import { VehicleKind } from '../types/vehiclekind';

@Injectable({
  providedIn: 'root',
})
export class ApiVehicleKindSource implements VehicleKindSource {
  private readonly _vehicleKindsApiUrl: string;
  private readonly _httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this._vehicleKindsApiUrl = `${apiUrl}/vehicles/kinds`;
    this._httpClient = httpClient;
  }

  retrieve(): Observable<VehicleKind[]> {
    return this._httpClient.get<VehicleKind[]>(this._vehicleKindsApiUrl);
  }
}
