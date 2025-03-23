import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../../shared/api/api-endpoint';
import { Observable } from 'rxjs';
import { Envelope } from '../../../shared/types/Envelope';
import { Advertisement } from '../types/advertisement';
import {
  mapToHttpParameters,
  Pagination,
} from '../../../shared/types/Pagination';
import {
  AdvertisementDto,
  createEmptyAdvertisementDto,
} from '../dto/advertisement-dto';

@Injectable({
  providedIn: 'root',
})
export class TransportCataloguePageHttpService {
  private readonly _httpClient: HttpClient;
  private readonly _apiUrl = apiUrl;
  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
  }

  public fetchAdvertisements(
    pagination: Pagination,
    advertisementDto: AdvertisementDto | null
  ): Observable<Envelope<Advertisement>> {
    const dtoToSend: AdvertisementDto = advertisementDto
      ? advertisementDto
      : createEmptyAdvertisementDto();

    return this._httpClient.post<Envelope<Advertisement>>(
      `${this._apiUrl}/advertisements`,
      dtoToSend,
      { params: mapToHttpParameters(pagination) }
    );
  }
}
