import { Injectable } from '@angular/core';
import { AdvertisementsHttpService } from './advertisements-http.service';
import {
  CategoryBrandFetcherResponse,
  TransportCatalogueCategorybrandFetcherService,
} from './transport-catalogue-categorybrand-fetcher.service';
import { AdvertisementFilter } from '../dto/advertisement-filter';
import { Pagination } from '../../../shared/types/Pagination';
import { Sorting } from '../../../shared/types/Sorting';
import { GeoInformation } from '../types/geoinformation';
import { Envelope } from '../../../shared/types/Envelope';
import { Observable } from 'rxjs';
import { AdvertisementsPageResponse } from '../responses/advertisements-page-response';
import { TransportCharacteristic } from '../types/transport-characteristic';
import { AdvertisementPricesResponse } from '../types/advertisement-prices-response';
import {
  CategoryBrandCharacteristicsItemViewModelResponse,
  CategoryBrandCharacteristicsViewModelResponse,
} from '../types/CategoryBrandCharacteristicsViewModelResponse';
import { AdvertisementsPageViewModelResponse } from '../types/AdvertisementsPageViewModelResponse';

@Injectable({
  providedIn: 'root',
})
export class TransportCataloguePageHttpService {
  private readonly _advertisementsHttpService: AdvertisementsHttpService;
  private readonly _categoryBrandFetcher: TransportCatalogueCategorybrandFetcherService;

  constructor(
    advertisementsHttpService: AdvertisementsHttpService,
    categoryBrandFetcher: TransportCatalogueCategorybrandFetcherService,
  ) {
    this._advertisementsHttpService = advertisementsHttpService;
    this._categoryBrandFetcher = categoryBrandFetcher;
  }

  public fetchCategoryBrands(
    categoryId: string,
    brandId: string,
  ): Observable<CategoryBrandFetcherResponse> {
    return this._categoryBrandFetcher.fetchCategoryBrands(categoryId, brandId);
  }

  public fetchCharacteristics(
    categoryId: string,
    brandId: string,
  ): Observable<Envelope<CategoryBrandCharacteristicsViewModelResponse[]>> {
    return this._advertisementsHttpService.fetchAdvertisementDetailedCharacteristics(
      categoryId,
      brandId,
    );
  }

  public fetchGeoInformation(
    categoryId: string,
    brandId: string,
  ): Observable<Envelope<GeoInformation[]>> {
    return this._advertisementsHttpService.fetchAdvertisementsGeoInformation(
      categoryId,
      brandId,
    );
  }

  public fetchAdvertisements(
    categoryId: string,
    brandId: string,
    filter: AdvertisementFilter,
    pagination: Pagination,
    sort: Sorting,
  ): Observable<Envelope<AdvertisementsPageViewModelResponse>> {
    return this._advertisementsHttpService.fetchAdvertisements(
      categoryId,
      brandId,
      filter,
      pagination,
      sort,
    );
  }

  public fetchPrices(
    categoryId: string,
    brandId: string,
    filter: AdvertisementFilter,
  ): Observable<Envelope<AdvertisementPricesResponse>> {
    return this._advertisementsHttpService.getAdvertisementsPrices(
      categoryId,
      brandId,
      filter,
    );
  }
}
