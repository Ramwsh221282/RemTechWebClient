import {
  Component,
  DestroyRef,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  VehiclesAggregatedDataBasicQuery,
  VehiclesAggregatedDataQuery,
} from '../../Models/Query/VehiclesAggregatedDataQuery';
import { HttpClient } from '@angular/common/http';
import { VehiclesAggregatedData } from '../../types/VehiclesAggregatedData';
import { StringUtils } from '../../../../shared/utils/string-utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Badge } from 'primeng/badge';

@Component({
  selector: 'app-vehicles-catalogue-aggregated-data-grid',
  imports: [Badge],
  templateUrl: './vehicles-catalogue-aggregated-data-grid.component.html',
  styleUrl: './vehicles-catalogue-aggregated-data-grid.component.scss',
})
export class VehiclesCatalogueAggregatedDataGridComponent {
  @Output() currentItemsCountChanged: EventEmitter<number> =
    new EventEmitter<number>();
  private readonly _kindId: WritableSignal<string>;
  private readonly _brandId: WritableSignal<string>;
  private readonly _query: WritableSignal<VehiclesAggregatedDataQuery>;
  private readonly _data: WritableSignal<VehiclesAggregatedData>;
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  constructor(httpClient: HttpClient) {
    this._kindId = signal('');
    this._brandId = signal('');
    this._query = signal(VehiclesAggregatedDataBasicQuery.default());
    this._data = signal({
      averagePrice: 0,
      maximalPrice: 0,
      minimalPrice: 0,
      pagesCount: 0,
      totalCount: 0,
    });
    effect((): void => {
      const kindId: string = this._kindId();
      const brandId: string = this._brandId();
      if (
        StringUtils.isEmptyOrWhiteSpace(kindId) ||
        StringUtils.isEmptyOrWhiteSpace(brandId)
      )
        return;
      const query: VehiclesAggregatedDataQuery = this._query();
      query
        .query(kindId, brandId, httpClient)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (data: VehiclesAggregatedData): void => {
            this.currentItemsCountChanged.emit(data.totalCount);
            this._data.set(data);
          },
        });
    });
  }

  @Input({ required: true }) set kind_id_setter(kindId: string) {
    this._kindId.set(kindId);
  }

  @Input({ required: true }) set brand_id_setter(brand_id: string) {
    this._brandId.set(brand_id);
  }

  @Input({ required: true }) set query_setter(
    query: VehiclesAggregatedDataQuery,
  ) {
    this._query.set(query);
  }

  public get data(): VehiclesAggregatedData {
    return this._data();
  }
}
