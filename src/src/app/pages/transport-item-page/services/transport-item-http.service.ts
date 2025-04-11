import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrl } from '../../../shared/api/api-endpoint';
import { Envelope } from '../../../shared/types/Envelope';
import { TransportItem } from '../types/transport-item';

@Injectable({
  providedIn: 'root',
})
export class TransportItemHttpService {
  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _apiUrl = `${apiUrl}/advertisements`;

  public getTransportItemById(id: number) {
    return this._httpClient.get<Envelope<TransportItem>>(
      `${this._apiUrl}/${id}`
    );
  }
}
