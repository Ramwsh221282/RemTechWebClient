import { HttpClient } from '@angular/common/http';
import { VehicleModelsSource } from './vehiclemodelssource';
import { VehicleKind } from '../types/vehiclekind';
import { VehicleBrand } from '../types/vehiclebrands';
import { Observable } from 'rxjs';
import { VehicleModel } from '../types/vehiclemodel';
import { apiUrl } from '../../../../shared/api/api-endpoint';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiVehicleModelsSource implements VehicleModelsSource {
  private readonly _httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
  }

  retrieve(kind: VehicleKind, brand: VehicleBrand): Observable<VehicleModel[]> {
    const url = `${apiUrl}/vehicles/kinds/${kind.id}/brands/${brand.id}/models`;
    return this._httpClient.get<VehicleModel[]>(url);
  }
}
