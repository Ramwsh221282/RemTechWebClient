import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../../shared/api/api-endpoint';
import { AdvertisementFilter } from '../dto/advertisement-filter';
import { Pagination } from '../../../shared/types/Pagination';
import { Sorting } from '../../../shared/types/Sorting';
import { Envelope } from '../../../shared/types/Envelope';
import { AdvertisementsPageResponse } from '../responses/advertisements-page-response';
import { TransportCharacteristic } from '../types/transport-characteristic';

@Injectable({
  providedIn: 'root',
})
export class AdvertisementsHttpService {
  private readonly _httpClient: HttpClient;
  private readonly _apiUrl = `${apiUrl}/advertisements`;

  public constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
  }

  public fetchAdvertisements(
    filter: AdvertisementFilter,
    pagination: Pagination,
    sort: Sorting
  ) {
    const httpParams: HttpParams = new HttpParams()
      .append('page', pagination.page)
      .append('pageSize', pagination.pageSize)
      .append('sort', sort.mode);

    const priceFilter = {
      priceFrom:
        filter.priceFilter.priceFrom === ''
          ? null
          : Number(filter.priceFilter.priceFrom),
      priceTo:
        filter.priceFilter.priceTo === ''
          ? null
          : Number(filter.priceFilter.priceTo),
    };
    const addressFilter =
      filter.addressFilter.address === ''
        ? null
        : { address: filter.addressFilter.address };
    const textFilter =
      filter.textFilter.text === '' ? null : { text: filter.textFilter.text };
    const characteristicsFilter =
      filter.characteristicsFilter.characteristics.length === 0
        ? null
        : { characteristics: filter.characteristicsFilter.characteristics };
    const payload = {
      filter: {
        priceFilter,
        addressFilter,
        textFilter,
        characteristicsFilter,
      },
    };
    return this._httpClient.post<Envelope<AdvertisementsPageResponse>>(
      this._apiUrl,
      payload,
      { params: httpParams }
    );
  }

  public fetchCharacteristics() {
    return this._httpClient.get<Envelope<TransportCharacteristic[]>>(
      `${this._apiUrl}/characteristics`
    );
  }
}
