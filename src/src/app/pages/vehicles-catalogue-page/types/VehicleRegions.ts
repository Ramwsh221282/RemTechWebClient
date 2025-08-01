import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '../../../shared/api/api-endpoint';

export interface VehicleRegion {
  id: string;
  name: string;
  kind: string;
}

@Injectable({
  providedIn: 'root',
})
export class VehicleRegionsSource {
  private readonly _httpClient: HttpClient;
  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
  }
  public fetch(
    kindId: string,
    brandId: string,
    modelId: string,
  ): Observable<VehicleRegion[]> {
    let params: HttpParams = new HttpParams()
      .set('kindId', kindId)
      .set('brandId', brandId)
      .set('modelId', modelId);
    const requestUrl: string = `${apiUrl}/locations`;
    return this._httpClient.get<VehicleRegion[]>(requestUrl, {
      params: params,
    });
  }
}
