import {
  Component,
  DestroyRef,
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
  VehiclesCatalogueQuery,
} from './Models/Query/VehiclesCatalogueQuery';
import { VehiclesCatalogueToolbarComponent } from './components/vehicles-catalogue-toolbar/vehicles-catalogue-toolbar.component';
import { Panel } from 'primeng/panel';
import { Select } from 'primeng/select';
import { VehicleCharacteristicsFormComponent } from './components/vehicle-characteristics-form/vehicle-characteristics-form.component';
import { Badge } from 'primeng/badge';

@Component({
  selector: 'app-vehicles-catalogue-page',
  imports: [
    VehiclesCatalogueToolbarComponent,
    Panel,
    Select,
    VehicleCharacteristicsFormComponent,
    Badge,
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

  constructor(activatedRoute: ActivatedRoute, httpClient: HttpClient) {
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
      const query = new BaseVehiclesCatalogueQuery(
        kindId,
        brandId,
        modelId,
        page,
      );
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
      this._query.set(
        new BaseVehiclesCatalogueQuery(kindId, brandId, modelId, page),
      );
    });
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
