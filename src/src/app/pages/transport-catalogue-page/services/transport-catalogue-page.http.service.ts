import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../../shared/api/api-endpoint';
import { Observable } from 'rxjs';
import { Envelope } from '../../../shared/types/Envelope';

@Injectable({
  providedIn: 'root',
})
export class TransportCataloguePageHttpService {
  private readonly _httpClient: HttpClient;
  private readonly _apiUrl = apiUrl;
  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
  }

  public fetchAdvertisements(): Observable<Envelope<any>> {}
}
