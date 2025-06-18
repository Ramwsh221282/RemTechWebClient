import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { sparesApiUrl } from '../../../shared/api/api-endpoint';
import { Observable } from 'rxjs';
import { Envelope } from '../../../shared/types/Envelope';
import { SpareTypeResponse } from '../types/spare-type-response';
import { SparePagedViewModel } from '../types/spare-paged-viewmodel';
import { SparePaginationPayload } from '../types/spare-pagination-payload';
import { SparesTypePayload } from '../types/spares-type-payload';
import { SpareOemPayload } from '../types/spare-oem-payload';
import { SpareSortPayload } from '../types/spare-sort-payload';
import { SpareTextSearchPayload } from '../types/spare-text-search-payload';
import { SparePriceRangePayload } from '../types/spare-price-range-payload';
import { SparePrice } from '../types/spare-price-response';

@Injectable({
  providedIn: 'root'
})
export class SparesHttpService {
  private readonly _apiUrl: string;

  constructor(private readonly _httpClient: HttpClient) {
    this._apiUrl = `${sparesApiUrl}/spares`;
  }

  public fetchSpareTypes(): Observable<Envelope<SpareTypeResponse[]>> {
    const apiUrl = this._apiUrl + '/types';
    return this._httpClient.get<Envelope<SpareTypeResponse[]>>(apiUrl);
  }

  public fetchSparePrices(): Observable<Envelope<SparePrice[]>> {
    const apiUrl = this._apiUrl + '/prices';
    return this._httpClient.get<Envelope<SparePrice[]>>(apiUrl);
  }

  public fetchSparesPagedViewModel(
    paginationPayload: SparePaginationPayload,
    typePayload?: SparesTypePayload | null,
    oemPayload?: SpareOemPayload | null,
    sortPayload?: SpareSortPayload | null,
    textSearch?: SpareTextSearchPayload | null,
    priceRange?: SparePriceRangePayload | null,
  ): Observable<Envelope<SparePagedViewModel>> {
    const query: object = {
      paginationPayload: paginationPayload,
      typePayload: typePayload,
      oemPayload: oemPayload,
      sortPayload: sortPayload,
      textSearch: textSearch,
      priceRange: priceRange,
    }
    return this._httpClient.post<Envelope<SparePagedViewModel>>(this._apiUrl, query)
  }
}
