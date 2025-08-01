import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BasicVehicleModel } from '../../types/BasicVehicleModel';
import { apiUrl } from '../../../../shared/api/api-endpoint';

@Injectable({
  providedIn: 'root',
})
export class BasicVehicleModelsSource {
  private readonly _httpClient: HttpClient;
  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
  }
  public fetch(
    brandId: string,
    kindId: string,
  ): Observable<BasicVehicleModel[]> {
    let params = new HttpParams().set('brandId', brandId).set('kindId', kindId);
    const requestUrl = `${apiUrl}/models`;
    return this._httpClient.get<BasicVehicleModel[]>(requestUrl, {
      params: params,
    });
  }
}
