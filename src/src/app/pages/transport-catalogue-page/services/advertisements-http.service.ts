import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../../shared/api/api-endpoint';
import { AdvertisementFilter } from '../dto/advertisement-filter';
import { Pagination } from '../../../shared/types/Pagination';
import { Sorting } from '../../../shared/types/Sorting';
import { Envelope } from '../../../shared/types/Envelope';
import { AdvertisementsPageResponse } from '../responses/advertisements-page-response';
import { Observable } from 'rxjs';
import { GeoInformation } from '../types/geoinformation';
import { TransportCharacteristic } from '../types/transport-characteristic';
import { TransportCategory } from '../transport-categories-menu/types/TransportCategory';
import { CategoryOfConcreteBrand } from '../category-brands-menu/types/category-of-concrete-brand';

@Injectable({
  providedIn: 'root',
})
export class AdvertisementsHttpService {
  private readonly _httpClient: HttpClient;

  public constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
  }

  public fetchAdvertisements(
    categoryId: string,
    brandId: string,
    filter: AdvertisementFilter,
    pagination: Pagination,
    sort: Sorting,
  ): Observable<Envelope<AdvertisementsPageResponse>> {
    const url = `${apiUrl}/transport-categories/${categoryId}/brands/${brandId}/advertisements`;

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
      filter.addressFilter.geoInformationId === ''
        ? null
        : { geoInformationId: filter.addressFilter.geoInformationId };
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
      url,
      payload,
      { params: httpParams },
    );
  }

  public fetchAdvertisementsGeoInformation(
    categoryId: string,
    brandId: string,
  ): Observable<Envelope<GeoInformation[]>> {
    const url = `${apiUrl}/transport-categories/${categoryId}/brands/${brandId}/geo`;
    return this._httpClient.get<Envelope<GeoInformation[]>>(url);
  }

  public fetchAdvertisementDetailedCharacteristics(
    categoryId: string,
    brandId: string,
  ): Observable<Envelope<TransportCharacteristic[]>> {
    const url = `${apiUrl}/transport-categories/${categoryId}/brands/${brandId}/characteristics`;
    return this._httpClient.get<Envelope<TransportCharacteristic[]>>(url);
  }

  public fetchCategoriesOfBrand(
    brandId: string,
    brandName: string,
  ): Observable<Envelope<CategoryOfConcreteBrand[]>> {
    const url = `${apiUrl}/transport-categories/brands/${brandId}/${brandName}/categories`;
    return this._httpClient.get<Envelope<CategoryOfConcreteBrand[]>>(url);
  }
}
