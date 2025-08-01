import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VehiclesCatalogue } from './Models/Catalogue/CatalogueVehicle';
import {
  BaseVehiclesCatalogueQuery,
  VehicleCatalogueQueryOtherKind,
  VehicleCatalogueQueryWithOtherBrand,
  VehicleCatalogueQueryWithOtherModel,
  VehiclesCatalogueQuery,
} from './Models/Query/VehiclesCatalogueQuery';
import { VehiclesCatalogueToolbarComponent } from './components/vehicles-catalogue-toolbar/vehicles-catalogue-toolbar.component';
import { Panel } from 'primeng/panel';
import { Select } from 'primeng/select';
import { VehicleCharacteristicsFormComponent } from './components/vehicle-characteristics-form/vehicle-characteristics-form.component';
import { Badge } from 'primeng/badge';
import { VehiclesDataViewComponent } from './components/vehicles-data-view/vehicles-data-view.component';
import { ScrollPanel } from 'primeng/scrollpanel';
import { StringUtils } from '../../shared/utils/string-utils';
import { VehiclesSelectNavigationChangeDialogComponent } from './components/vehicles-select-navigation-change-dialog/vehicles-select-navigation-change-dialog.component';
import { CatalogueNavigationChange } from './types/CatalogueNavigationChange';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-vehicles-catalogue-page',
  imports: [
    VehiclesCatalogueToolbarComponent,
    Panel,
    VehicleCharacteristicsFormComponent,
    Badge,
    VehiclesDataViewComponent,
    Dialog,
  ],
  templateUrl: './vehicles-catalogue-page.component.html',
  styleUrl: './vehicles-catalogue-page.component.scss',
})
export class VehiclesCataloguePageComponent implements OnInit {
  private readonly _activatedRoute: ActivatedRoute;
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _isLoading: WritableSignal<boolean>;
  private readonly _query: WritableSignal<VehiclesCatalogueQuery>;
  private readonly _httpClient: HttpClient;
  private readonly _currentKindId: WritableSignal<string>;
  private readonly _currentBrandId: WritableSignal<string>;
  private readonly _currentModelId: WritableSignal<string>;
  private readonly _catalogueData: WritableSignal<VehiclesCatalogue>;
  private readonly _currentPage: WritableSignal<number>;

  constructor(activatedRoute: ActivatedRoute, httpClient: HttpClient) {
    this._currentPage = signal(1);
    this._activatedRoute = activatedRoute;
    this._isLoading = signal(false);
    this._query = signal(BaseVehiclesCatalogueQuery.default());
    this._httpClient = httpClient;
    this._currentKindId = signal('');
    this._currentBrandId = signal('');
    this._currentModelId = signal('');
    this._catalogueData = signal({
      vehicles: [],
      aggregatedData: {
        totalCount: 0,
        pagesCount: 0,
        averagePrice: 0,
        maximalPrice: 0,
        minimalPrice: 0,
      },
      characteristics: { characteristics: [] },
      geoLocations: [],
    });
    effect(() => {
      const kindId = this._currentKindId();
      if (StringUtils.isEmptyOrWhiteSpace(kindId)) return;
      const brandId = this._currentBrandId();
      if (StringUtils.isEmptyOrWhiteSpace(brandId)) return;
      const modelId = this._currentModelId();
      if (StringUtils.isEmptyOrWhiteSpace(modelId)) return;
      const currentPage = this._currentPage();
      if (currentPage <= 0) return;
      const query = this._query();
      query
        .query(kindId, brandId, modelId, this._httpClient)
        .pipe(
          takeUntilDestroyed(this._destroyRef),
          finalize((): void => {
            this._isLoading.set(false);
          }),
        )
        .subscribe({
          next: (data: VehiclesCatalogue): void => {
            this._catalogueData.set(data);
          },
          error: (err: HttpErrorResponse): void => {
            console.log(err);
          },
        });
    });
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
      this._query.set(query);
    });
  }

  public acceptNavigationChange($event: CatalogueNavigationChange): void {
    const current = this._query();
    this._currentKindId.set($event.kind.id);
    this._currentBrandId.set($event.brand.id);
    this._currentModelId.set($event.model.id);
    const changed = new VehicleCatalogueQueryOtherKind(
      $event.kind.id,
      new VehicleCatalogueQueryWithOtherBrand(
        $event.brand.id,
        new VehicleCatalogueQueryWithOtherModel($event.model.id, current),
      ),
    );
    this._query.set(changed);
  }

  public get currentKindId(): string {
    return this._currentKindId();
  }

  public get currentBrandId(): string {
    return this._currentBrandId();
  }

  public get currentModelId(): string {
    return this._currentModelId();
  }

  public get catalogueData(): VehiclesCatalogue {
    return this._catalogueData();
  }
}
