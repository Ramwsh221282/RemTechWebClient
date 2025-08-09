import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '../../../shared/api/api-endpoint';
import { Injectable } from '@angular/core';

export interface VehicleCharacteristic {
  id: string;
  name: string;
  measure: string;
  values: VehicleCharacteristicValue[];
}

export interface VehicleCharacteristicValue {
  characteristicId: string;
  value: string;
}

@Injectable({
  providedIn: 'root',
})
export class VehicleCharacteristicsSource {
  private readonly _httpClient: HttpClient;
  constructor(private readonly http: HttpClient) {
    this._httpClient = http;
  }
  public fetch(
    kindId: string,
    brandId: string,
  ): Observable<VehicleCharacteristic[]> {
    let params: HttpParams = new HttpParams()
      .set('kindId', kindId)
      .set('brandId', brandId);
    const requestUrl = `${apiUrl}/vehicle-characteristics`;
    return this._httpClient.get<VehicleCharacteristic[]>(requestUrl, {
      params: params,
    });
  }
}
