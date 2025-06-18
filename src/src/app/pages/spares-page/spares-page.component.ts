import { ChangeDetectionStrategy, Component, OnInit, signal, WritableSignal } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { SparesFilterFormComponent } from "./spares-filter-form/spares-filter-form.component";
import { SparesPriceCriteriaFilterInputComponent } from "./spares-filter-form/spares-price-criteria-filter-input/spares-price-criteria-filter-input.component";
import { SparesTypeSelectFilterComponent } from "./spares-filter-form/spares-type-select-filter/spares-type-select-filter.component";
import { SparesOemFilterInputComponent } from "./spares-filter-form/spares-oem-filter-input/spares-oem-filter-input.component";
import { SparePaginationPayload, SparePaginationPayloadFactory } from './types/spare-pagination-payload';
import { SparesHttpService } from './services/spares-http.service';
import { Envelope } from '../../shared/types/Envelope';
import { SparePagedViewModel, SparePriceViewModel } from './types/spare-paged-viewmodel';
import { finalize } from 'rxjs';
import { SpareViewModel } from './types/spare-viewmodel';
import { SparesListComponent } from "./spares-list/spares-list.component";
import { DecimalPipe, NgIf } from '@angular/common';
import { SparesTypePayload } from './types/spares-type-payload';
import { SparePriceRangePayload } from './types/spare-price-range-payload';
import { SpareOemPayload } from './types/spare-oem-payload';
import { SpareSortPayload } from './types/spare-sort-payload';
import { SpareTextSearchPayload } from './types/spare-text-search-payload';
import { Sorting, SortingFactory } from '../../shared/types/Sorting';
import { SpareListPaginationComponent } from "./spares-list/spare-list-pagination/spare-list-pagination.component";
import { SparePriceChartComponent } from "./spare-price-chart/spare-price-chart.component";
import { SparePhotoDialogComponent } from "./spare-photo-dialog/spare-photo-dialog.component";
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-spares-page',
  imports: [PanelModule, SparesFilterFormComponent, SparesPriceCriteriaFilterInputComponent, SparesTypeSelectFilterComponent, SparesOemFilterInputComponent, SparesListComponent, DecimalPipe, SpareListPaginationComponent, SparePriceChartComponent, SparePhotoDialogComponent, NgIf, ProgressSpinnerModule],
  templateUrl: './spares-page.component.html',
  styleUrl: './spares-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SparesPageComponent implements OnInit {
  readonly paginationSignal: WritableSignal<SparePaginationPayload>
  readonly sparesSignal: WritableSignal<SpareViewModel[]>
  readonly isLoadingSignal: WritableSignal<boolean>
  readonly priceAvgSignal: WritableSignal<number>;
  readonly priceMinSignal: WritableSignal<number>;
  readonly priceMaxSignal: WritableSignal<number>;
  readonly totalCountSignal: WritableSignal<number>;
  readonly totalPagesCount: WritableSignal<number>;
  readonly spareTypeFilter: WritableSignal<SparesTypePayload | null>;
  readonly sparePriceRangeFilter: WritableSignal<SparePriceRangePayload | null>
  readonly oemPayloadFilter: WritableSignal<SpareOemPayload | null>;
  readonly sortPayloadFilter: WritableSignal<SpareSortPayload | null>;
  readonly textSearchPayloadFilter: WritableSignal<SpareTextSearchPayload | null>;
  readonly sorting: WritableSignal<Sorting>;
  readonly sparePrices: WritableSignal<SparePriceViewModel[]>;
  readonly selectedSpare: WritableSignal<SpareViewModel | null>

  constructor(private readonly _httpService: SparesHttpService) {
    this.selectedSpare = signal(null);
    this.sparePrices = signal([]);
    this.sorting = signal(SortingFactory.default());
    this.textSearchPayloadFilter = signal(null);
    this.paginationSignal = signal(SparePaginationPayloadFactory.empty());
    this.oemPayloadFilter = signal(null)
    this.spareTypeFilter = signal(null);
    this.sparePriceRangeFilter = signal(null);
    this.sortPayloadFilter = signal(null);
    this.sparesSignal = signal([]);
    this.isLoadingSignal = signal(false);
    this.priceAvgSignal = signal(0);
    this.priceMaxSignal = signal(0);
    this.totalCountSignal = signal(0);
    this.totalPagesCount = signal(0);
    this.priceMinSignal = signal(0);
  }

  ngOnInit(): void {
    this.fetchItems();
  }

  private fetchItems(): void {
    this.isLoadingSignal.set(true)
    this._httpService.fetchSparesPagedViewModel(this.paginationSignal(), this.spareTypeFilter(), this.oemPayloadFilter(), this.sortPayloadFilter(), this.textSearchPayloadFilter(), this.sparePriceRangeFilter())
      .pipe(finalize(() => {
        this.isLoadingSignal.set(false)
      }))
      .subscribe({
        next: (envelope: Envelope<SparePagedViewModel>): void => {
          if (envelope.code === 200) {
            const data: SparePagedViewModel = envelope.data;
            this.sparesSignal.set(data.spares);
            this.priceAvgSignal.set(data.priceAvg);
            this.priceMinSignal.set(data.priceMin);
            this.priceMaxSignal.set(data.priceMax);
            this.totalPagesCount.set(data.pagesCount);
            this.totalCountSignal.set(data.totalCount);
            this.sparePrices.set(data.prices);
          }
        }
      })
  }

  public spareDeselected(): void {
    this.selectedSpare.set(null);
  }

  public spareSelected(spare: SpareViewModel): void {
    this.selectedSpare.set(spare);
  }

  public handleSpareTypeChange($event: SparesTypePayload | null): void {
    this.spareTypeFilter.set($event);
    this.fetchItems();
  }

  public handleSparePriceRangeChange($event: SparePriceRangePayload | null): void {
    this.sparePriceRangeFilter.set($event);
    this.fetchItems();
  }

  public handleOemFilterChange($event: SpareOemPayload | null): void {
    this.oemPayloadFilter.set($event);
    this.fetchItems();
  }

  public handleSortChange($event: SpareSortPayload | null): void {
    this.sortPayloadFilter.set($event);
    if (!$event) {
      this.sorting.set(SortingFactory.default());
    }
    if ($event) {
      this.sorting.set({ mode: $event.sortMode })
    }
    this.fetchItems();
  }

  public handleTextSearchChange($event: SpareTextSearchPayload | null): void {
    this.textSearchPayloadFilter.set($event);
    this.fetchItems();
  }

  public handlePageChange($event: number): void {
    const pagination = this.paginationSignal();
    const updated = { ...pagination, page: $event };
    this.paginationSignal.set(updated);
    this.fetchItems();
  }
}
