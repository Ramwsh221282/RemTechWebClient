import { Injectable } from '@angular/core';
import { AdvertisementsHttpService } from './advertisements-http.service';
import { TransportCharacteristicsHttpService } from './transport-characteristics-http.service';
import { TransportCatalogueCategorybrandFetcherService } from './transport-catalogue-categorybrand-fetcher.service';
import { AdvertisementFilter } from '../dto/advertisement-filter';
import { Pagination } from '../../../shared/types/Pagination';
import { Sorting } from '../../../shared/types/Sorting';

@Injectable({
  providedIn: 'root',
})
export class TransportCataloguePageHttpService {
  private readonly _advertisementsHttpService: AdvertisementsHttpService;
  private readonly _characteristicsHttpService: TransportCharacteristicsHttpService;
  private readonly _categoryBrandFetcher: TransportCatalogueCategorybrandFetcherService;

  constructor(
    advertisementsHttpService: AdvertisementsHttpService,
    characteristicsHttpService: TransportCharacteristicsHttpService,
    categoryBrandFetcher: TransportCatalogueCategorybrandFetcherService,
  ) {
    this._advertisementsHttpService = advertisementsHttpService;
    this._characteristicsHttpService = characteristicsHttpService;
    this._categoryBrandFetcher = categoryBrandFetcher;
  }

  public fetchCategoryBrands(categoryId: string, brandId: string) {
    return this._categoryBrandFetcher.fetchCategoryBrands(categoryId, brandId);
  }

  public fetchCharacteristics() {
    return this._characteristicsHttpService.fetchCharacteristics();
  }

  public fetchAdvertisements(
    categoryId: string,
    brandId: string,
    filter: AdvertisementFilter,
    pagination: Pagination,
    sort: Sorting,
  ) {
    return this._advertisementsHttpService.fetchAdvertisements(
      categoryId,
      brandId,
      filter,
      pagination,
      sort,
    );
  }
}
