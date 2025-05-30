import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { advertisementsApi } from '../../../shared/api/api-endpoint';
import { AdvertisementFilter } from '../dto/advertisement-filter';
import { Pagination } from '../../../shared/types/Pagination';
import { Sorting } from '../../../shared/types/Sorting';
import { Envelope } from '../../../shared/types/Envelope';
import { AdvertisementsPageResponse } from '../responses/advertisements-page-response';
import { Observable } from 'rxjs';
import { GeoInformation } from '../types/geoinformation';
import { TransportCharacteristic } from '../types/transport-characteristic';
import { CategoryOfConcreteBrand } from '../category-brands-menu/types/category-of-concrete-brand';
import { Advertisement } from '../types/advertisement';
import { StatisticalCategory } from '../../admin-page/admin-panel-menu/admin-panel-analytics-menu/types/statistical-category';
import { AdvertisementPricesResponse } from '../types/advertisement-prices-response';
import { TransportModelDto } from '../dto/advertisement-dto';
import {
  CategoryBrandCharacteristicsItemViewModelResponse,
  CategoryBrandCharacteristicsViewModelResponse,
} from '../types/CategoryBrandCharacteristicsViewModelResponse';
import {
  AdvertisementsPageViewModelResponse,
  AdvertisementViewModelResponse,
} from '../types/AdvertisementsPageViewModelResponse';

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
  ): Observable<Envelope<AdvertisementsPageViewModelResponse>> {
    const url = `${advertisementsApi}/transport-categories/${categoryId}/brands/${brandId}/advertisements`;
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
    return this._httpClient.post<Envelope<AdvertisementsPageViewModelResponse>>(
      url,
      payload,
      { params: httpParams },
    );
  }

  public fetchAdvertisementsGeoInformation(
    categoryId: string,
    brandId: string,
  ): Observable<Envelope<GeoInformation[]>> {
    const url = `${advertisementsApi}/transport-categories/${categoryId}/brands/${brandId}/geo`;
    return this._httpClient.get<Envelope<GeoInformation[]>>(url);
  }

  public fetchAdvertisementDetailedCharacteristics(
    categoryId: string,
    brandId: string,
  ): Observable<Envelope<CategoryBrandCharacteristicsViewModelResponse[]>> {
    const url = `${advertisementsApi}/transport-categories/${categoryId}/brands/${brandId}/characteristics`;
    return this._httpClient.get<
      Envelope<CategoryBrandCharacteristicsViewModelResponse[]>
    >(url);
  }

  public fetchCategoriesOfBrand(
    brandId: string,
    brandName: string,
  ): Observable<Envelope<CategoryOfConcreteBrand[]>> {
    const url = `${advertisementsApi}/transport-categories/brands/${brandId}/${brandName}/categories`;
    return this._httpClient.get<Envelope<CategoryOfConcreteBrand[]>>(url);
  }

  public fetchAdvertisementByCategoryBrandId(
    categoryId: string,
    brandId: string,
    advertisementId: string,
  ): Observable<Envelope<AdvertisementViewModelResponse>> {
    const url = `${advertisementsApi}/transport-categories/${categoryId}/brands/${brandId}/advertisements/${advertisementId}`;
    return this._httpClient.get<Envelope<AdvertisementViewModelResponse>>(url);
  }

  public getStatisticalData(): Observable<Envelope<StatisticalCategory[]>> {
    const url = `${advertisementsApi}/transport-categories/statistics`;
    return this._httpClient.get<Envelope<StatisticalCategory[]>>(url);
  }

  public getAdvertisementsPrices(
    categoryId: string,
    brandId: string,
    filter: AdvertisementFilter,
  ): Observable<Envelope<AdvertisementPricesResponse>> {
    const url = `${advertisementsApi}/transport-categories/${categoryId}/brands/${brandId}/advertisements/prices`;

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
    return this._httpClient.post<Envelope<AdvertisementPricesResponse>>(
      url,
      payload,
    );
  }

  public fetchTransportModels(
    categoryId: string,
    brandId: string,
    geoId?: string | null,
  ): Observable<Envelope<TransportModelDto[]>> {
    const url = `${advertisementsApi}/transport-categories/${categoryId}/brands/${brandId}/models`;
    let params: HttpParams = new HttpParams();

    if (geoId) params = params.append('geoId', geoId);

    return this._httpClient.get<Envelope<TransportModelDto[]>>(url, {
      params: params,
    });
  }
}
