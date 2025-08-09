import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BaseVehiclesCatalogueQuery,
  VehicleCatalogueQueryOtherKind,
  VehicleCatalogueQueryWithOtherBrand,
  VehicleCatalogueQueryWithOtherModel,
  VehicleCatalogueQueryWithOtherPage,
  VehiclesCatalogueQuery,
  VehiclesCatalogueQueryWithCharacteristics,
  VehiclesCatalogueQueryWithLocation,
  VehiclesCatalogueQueryWithPrice,
  VehiclesCatalogueQueryWithTextSearch,
} from './Models/Query/VehiclesCatalogueQuery';
import { VehiclesCatalogueToolbarComponent } from './components/vehicles-catalogue-toolbar/vehicles-catalogue-toolbar.component';
import { Panel } from 'primeng/panel';
import { VehicleCharacteristicsFormComponent } from './components/vehicle-characteristics-form/vehicle-characteristics-form.component';
import { VehiclesDataViewComponent } from './components/vehicles-data-view/vehicles-data-view.component';
import { CatalogueNavigationChange } from './types/CatalogueNavigationChange';
import {
  VehiclesCatalogueQueryCharacteristicsList,
  VehiclesCatalogueQueryLocationId,
  VehiclesCatalogueQueryPriceSpecification,
  VehiclesCatalogueTextSearchQuery,
} from './Models/QueryArguments/QueryArguments';
import { VehiclesCatalogueAggregatedDataGridComponent } from './components/vehicles-catalogue-aggregated-data-grid/vehicles-catalogue-aggregated-data-grid.component';
import {
  VehiclesAggregatedDataBasicQuery,
  VehiclesAggregatedDataBrandChangedQuery,
  VehiclesAggregatedDataCharacteristicsChangedQuery,
  VehiclesAggregatedDataKindChangedQuery,
  VehiclesAggregatedDataModelChangedQuery,
  VehiclesAggregatedDataPriceChangedQuery,
  VehiclesAggregatedDataQuery,
  VehiclesAggregatedDataRegionChangedQuery,
} from './Models/Query/VehiclesAggregatedDataQuery';
import { VehiclesCatalogueRegionsSelectComponent } from './components/vehicles-catalogue-regions-select/vehicles-catalogue-regions-select.component';
import { VehiclesCatlaoguePricesFilterComponent } from './components/vehicles-catlaogue-prices-filter/vehicles-catlaogue-prices-filter.component';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { NgIf } from '@angular/common';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-vehicles-catalogue-page',
  imports: [
    VehiclesCatalogueToolbarComponent,
    Panel,
    VehicleCharacteristicsFormComponent,
    VehiclesDataViewComponent,
    VehiclesCatalogueAggregatedDataGridComponent,
    VehiclesCatalogueRegionsSelectComponent,
    VehiclesCatlaoguePricesFilterComponent,
    Paginator,
    NgIf,
    InputText,
  ],
  templateUrl: './vehicles-catalogue-page.component.html',
  styleUrl: './vehicles-catalogue-page.component.scss',
})
export class VehiclesCataloguePageComponent implements OnInit {
  private readonly _activatedRoute: ActivatedRoute;
  private readonly _query: WritableSignal<VehiclesCatalogueQuery>;
  private readonly _aggregatedDataQuery: WritableSignal<VehiclesAggregatedDataQuery>;
  private readonly _currentKindId: WritableSignal<string>;
  private readonly _currentBrandId: WritableSignal<string>;
  private readonly _currentModelId: WritableSignal<string>;
  private readonly _currentPage: WritableSignal<number>;
  private readonly _currentItemsCount: WritableSignal<number>;

  constructor(activatedRoute: ActivatedRoute) {
    this._currentPage = signal(1);
    this._activatedRoute = activatedRoute;
    this._query = signal(BaseVehiclesCatalogueQuery.default());
    this._aggregatedDataQuery = signal(
      VehiclesAggregatedDataBasicQuery.default(),
    );
    this._currentKindId = signal('');
    this._currentBrandId = signal('');
    this._currentModelId = signal('');
    this._currentItemsCount = signal(0);
  }

  public ngOnInit(): void {
    this._activatedRoute.params.subscribe((params) => {
      const kindId = params['kindId'] as string;
      const brandId = params['brandId'] as string;
      const modelId = params['modelId'] as string;
      const page = 1;
      this._currentKindId.set(kindId);
      this._currentModelId.set(modelId);
      this._currentBrandId.set(brandId);
      this._currentPage.set(page);
      const query = new BaseVehiclesCatalogueQuery(
        kindId,
        brandId,
        modelId,
        page,
      );
      const aggregatedDataQuery = new VehiclesAggregatedDataBasicQuery(
        kindId,
        modelId,
        brandId,
      );
      this._aggregatedDataQuery.set(aggregatedDataQuery);
      this._query.set(query);
    });
  }

  public acceptItemsCountChange($event: number): void {
    this._currentItemsCount.set($event);
  }

  public acceptNavigationChange($event: CatalogueNavigationChange): void {
    const currentVehiclesQuery: VehiclesCatalogueQuery = this._query();
    const currentAggregatedDataQuery: VehiclesAggregatedDataQuery =
      this._aggregatedDataQuery();
    this._currentKindId.set($event.kind.id);
    this._currentBrandId.set($event.brand.id);
    this._currentModelId.set($event.model.id);
    const vehiclesQueryChanged = new VehicleCatalogueQueryOtherKind(
      $event.kind.id,
      new VehicleCatalogueQueryWithOtherBrand(
        $event.brand.id,
        new VehicleCatalogueQueryWithOtherModel(
          $event.model.id,
          currentVehiclesQuery,
        ),
      ),
    );
    const aggregatedDataQueryChanged =
      new VehiclesAggregatedDataKindChangedQuery(
        $event.kind.id,
        new VehiclesAggregatedDataBrandChangedQuery(
          $event.brand.id,
          new VehiclesAggregatedDataModelChangedQuery(
            $event.model.id,
            currentAggregatedDataQuery,
          ),
        ),
      );
    this._query.set(vehiclesQueryChanged);
    this._aggregatedDataQuery.set(aggregatedDataQueryChanged);
  }

  public acceptCharacteristicsList(
    $event: VehiclesCatalogueQueryCharacteristicsList,
  ): void {
    const currentVehiclesQuery: VehiclesCatalogueQuery = this._query();
    const currentAggregatedDataQuery: VehiclesAggregatedDataQuery =
      this._aggregatedDataQuery();
    this._query.set(
      new VehiclesCatalogueQueryWithCharacteristics(
        currentVehiclesQuery,
        $event,
      ),
    );
    this._aggregatedDataQuery.set(
      new VehiclesAggregatedDataCharacteristicsChangedQuery(
        $event,
        currentAggregatedDataQuery,
      ),
    );
  }

  public acceptTextSearch($event: VehiclesCatalogueTextSearchQuery): void {
    const currentVehiclesQuery: VehiclesCatalogueQuery = this._query();
    this._query.set(
      new VehiclesCatalogueQueryWithTextSearch(currentVehiclesQuery, $event),
    );
  }

  public acceptRegionChange($event: VehiclesCatalogueQueryLocationId): void {
    const currentVehiclesQuery: VehiclesCatalogueQuery = this._query();
    const currentAggregatedDataQuery: VehiclesAggregatedDataQuery =
      this._aggregatedDataQuery();
    this._query.set(
      new VehiclesCatalogueQueryWithLocation(currentVehiclesQuery, $event),
    );
    this._aggregatedDataQuery.set(
      new VehiclesAggregatedDataRegionChangedQuery(
        $event,
        currentAggregatedDataQuery,
      ),
    );
  }

  public acceptPriceFilterChange(
    $event: VehiclesCatalogueQueryPriceSpecification,
  ): void {
    const currentVehiclesQuery: VehiclesCatalogueQuery = this._query();
    const currentAggregatedDataQuery: VehiclesAggregatedDataQuery =
      this._aggregatedDataQuery();
    this._query.set(
      new VehiclesCatalogueQueryWithPrice(currentVehiclesQuery, $event),
    );
    this._aggregatedDataQuery.set(
      new VehiclesAggregatedDataPriceChangedQuery(
        $event,
        currentAggregatedDataQuery,
      ),
    );
  }

  public get currentKindId(): string {
    return this._currentKindId();
  }

  public get currentBrandId(): string {
    return this._currentBrandId();
  }

  public get currentItemsCount(): number {
    return this._currentItemsCount();
  }

  public get currentModelId(): string {
    return this._currentModelId();
  }

  public acceptPageChange(paginator: PaginatorState): void {
    const page: number | undefined = paginator.page;
    const totalPages: number | undefined = paginator.pageCount;
    if (!page || !totalPages) {
      this._currentPage.set(1);
      this.updatePageQuery();
      return;
    }
    if (totalPages - page === 1) {
      this._currentPage.set(totalPages);
      this.updatePageQuery();
      return;
    }
    const incremented: number = page + 1;
    this._currentPage.set(incremented);
    this.updatePageQuery();
  }

  private updatePageQuery(): void {
    const query: VehiclesCatalogueQuery = this._query();
    this._query.set(
      new VehicleCatalogueQueryWithOtherPage(this._currentPage(), query),
    );
  }

  public get aggregatedDataQuery(): VehiclesAggregatedDataQuery {
    return this._aggregatedDataQuery();
  }

  public get vehiclesQuery(): VehiclesCatalogueQuery {
    return this._query();
  }
}
