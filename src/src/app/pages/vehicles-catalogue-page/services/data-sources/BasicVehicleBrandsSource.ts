import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BasicVehicleBrand } from '../../types/BasicVehicleBrand';
import { apiUrl } from '../../../../shared/api/api-endpoint';

@Injectable({
  providedIn: 'root',
})
export class BasicVehicleBrandsSource {
  private readonly _httpClient: HttpClient;
  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
  }
  public fetch(kindId: string): Observable<BasicVehicleBrand[]> {
    let params = new HttpParams().set('kindId', kindId);
    const requestUrl = `${apiUrl}/brands`;
    return this._httpClient.get<BasicVehicleBrand[]>(requestUrl, {
      params: params,
    });
  }
}
