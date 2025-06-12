import { Injectable } from '@angular/core';
import { sparesApiUrl } from '../../../../../shared/api/api-endpoint';
import { Observable } from 'rxjs';
import { Envelope } from '../../../../../shared/types/Envelope';
import { SparesStatisticalData } from '../models/spares-statistical-data';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SparesHttpService {
  private readonly _httpClient: HttpClient;
  private readonly _apiUrl: string;

  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
    this._apiUrl = sparesApiUrl;
  }

  public fetchStatistics(): Observable<Envelope<SparesStatisticalData[]>> {
    const url = `${this._apiUrl}/spares/statistics`;
    return this._httpClient.get<Envelope<SparesStatisticalData[]>>(url);
  }
}
