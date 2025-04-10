import { Injectable, signal, WritableSignal } from '@angular/core';
import { Pagination } from '../../../shared/types/Pagination';
import { Sorting } from '../../../shared/types/Sorting';
import {
  AdvertisementFilter,
  AdvertisementFilterService,
} from '../dto/advertisement-filter';

@Injectable({
  providedIn: 'root',
})
export class TransportCatalogueFilterViewModel {
  private readonly _totals: WritableSignal<number> = signal(0);

  private readonly _pagination: WritableSignal<Pagination> = signal({
    page: 1,
    pageSize: 10,
  });

  private readonly _sortMode: WritableSignal<Sorting> = signal({
    mode: 'NONE',
  });

  private readonly _filter: WritableSignal<AdvertisementFilter> = signal(
    AdvertisementFilterService.createEmpty()
  );

  public get totals(): number {
    return this._totals();
  }

  public get pagination(): Pagination {
    return this._pagination();
  }

  public get sortMode(): Sorting {
    return this._sortMode();
  }

  public get filter(): AdvertisementFilter {
    return this._filter();
  }

  public updatePagination(pagination: Pagination): void {
    this._pagination.set(pagination);
  }

  public updateTotals(totals: number): void {
    this._totals.set(totals);
  }

  public updateSortMode(sorting: Sorting): void {
    this._sortMode.set(sorting);
  }

  public updateFilters(filters: AdvertisementFilter): void {
    this._filter.set(filters);
  }
}
