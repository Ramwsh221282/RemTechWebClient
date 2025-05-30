import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { advertisementsApi } from '../../../shared/api/api-endpoint';
import { Envelope } from '../../../shared/types/Envelope';
import { AdvertisementViewModelResponse } from '../../transport-catalogue-page/types/AdvertisementsPageViewModelResponse';

@Injectable({
  providedIn: 'root',
})
export class TransportItemHttpService {
  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _apiUrl = `${advertisementsApi}/advertisements`;

  public getTransportItemById(id: number) {
    return this._httpClient.get<Envelope<AdvertisementViewModelResponse>>(
      `${this._apiUrl}/${id}`,
    );
  }
}
