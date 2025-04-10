import { Injectable, signal, WritableSignal } from '@angular/core';
import { TransportCataloguePageViewModel } from './transport-catalogue-page.viewmodel.service';
import { TransportCatalogueFilterViewModel } from './transport-catalogue-filter.viewmodel';
import { AdvertisementsHttpService } from './advertisements-http.service';
import { AdvertisementsPageResponse } from '../responses/advertisements-page-response';
import { Advertisement } from '../types/advertisement';
import { finalize } from 'rxjs';
import {
  AdvertisementFilter,
  AdvertisementFilterService,
} from '../dto/advertisement-filter';
import { TransportCharacteristic } from '../types/transport-characteristic';
import { Sorting } from '../../../shared/types/Sorting';
import { Pagination } from '../../../shared/types/Pagination';

@Injectable({
  providedIn: 'root',
})
export class TransportCataloguePageService {
  private readonly _advertisementsViewModel: TransportCataloguePageViewModel;
  private readonly _filterViewModel: TransportCatalogueFilterViewModel;
  private _isLoading: WritableSignal<boolean> = signal(false);
  private _selectedForPhotoView: WritableSignal<Advertisement | null> =
    signal(null);
  private readonly _httpService: AdvertisementsHttpService;

  public constructor(
    advertisementsViewModel: TransportCataloguePageViewModel,
    filterViewModel: TransportCatalogueFilterViewModel,
    httpService: AdvertisementsHttpService
  ) {
    this._advertisementsViewModel = advertisementsViewModel;
    this._filterViewModel = filterViewModel;
    this._httpService = httpService;
  }

  public initialize(): void {
    this.fetchData();
    this.fetchCharacteristics();
  }

  public get advertisements(): Advertisement[] {
    return this._advertisementsViewModel.advertisements;
  }

  public get characteristics(): TransportCharacteristic[] {
    return this._advertisementsViewModel.characteristics;
  }

  public get isLoading(): boolean {
    return this._isLoading();
  }

  public get filter(): AdvertisementFilter {
    return this._filterViewModel.filter;
  }

  public get totalCount(): number {
    return this._filterViewModel.totals;
  }

  public get sortMode(): Sorting {
    return this._filterViewModel.sortMode;
  }

  public get pagination(): Pagination {
    return this._filterViewModel.pagination;
  }

  public get selectedAdvertisementForPhotoView(): Advertisement | null {
    return this._selectedForPhotoView();
  }

  public updateSortMode(sorting: Sorting): void {
    this._filterViewModel.updateSortMode(sorting);
    this.fetchData();
  }

  public updateFilter(filter: AdvertisementFilter): void {
    this._filterViewModel.updateFilters(filter);
  }

  public updatePagination(pagination: Pagination): void {
    this._filterViewModel.updatePagination(pagination);
    this.fetchData();
  }

  public updateSearchTerm(searchTerm: string): void {
    const filters = this._filterViewModel.filter;
    const updated = AdvertisementFilterService.applyTextFilter(
      filters,
      searchTerm
    );
    this._filterViewModel.updateFilters(updated);
    this.fetchData();
  }

  public selectAdvertisementForPhotoView(advertisement: Advertisement): void {
    this._selectedForPhotoView.set(advertisement);
  }

  public hideAdvertisementForPhotoView(): void {
    const selected = this.selectAdvertisementForPhotoView;
    if (!selected) return;
    this._selectedForPhotoView.set(null);
  }

  public fetchData(): void {
    this._isLoading.set(true);
    this._httpService
      .fetchAdvertisements(
        this._filterViewModel.filter,
        this._filterViewModel.pagination,
        this._filterViewModel.sortMode
      )
      .pipe(
        finalize(() => {
          this._isLoading.set(false);
        })
      )
      .subscribe((response) => {
        const data: AdvertisementsPageResponse = response.data;
        this._advertisementsViewModel.updateAdvertisements(data.advertisements);
        this._filterViewModel.updateTotals(data.totals);
      });
  }

  private fetchCharacteristics(): void {
    this._httpService.fetchCharacteristics().subscribe((response) => {
      const items: TransportCharacteristic[] = response.data;
      this._advertisementsViewModel.updateCharacteristics(items);
    });
  }
}
