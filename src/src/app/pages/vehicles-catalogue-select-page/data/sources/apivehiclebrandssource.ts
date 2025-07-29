import { Observable } from 'rxjs';
import { VehicleBrand } from '../types/vehiclebrands';
import { VehicleKind } from '../types/vehiclekind';
import { VehicleBrandsSource } from './vehiclebrandssource';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../../../shared/api/api-endpoint';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiVehicleBrandsSource implements VehicleBrandsSource {
  private readonly _httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
  }

  retrieve(kind: VehicleKind): Observable<VehicleBrand[]> {
    const requestUrl = `${apiUrl}/vehicles/kinds/${kind.id}/brands`;
    return this._httpClient.get<VehicleBrand[]>(requestUrl);
  }
}
