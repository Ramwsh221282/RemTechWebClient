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

@Component({
  selector: 'app-vehicles-catalogue-page',
  imports: [],
  templateUrl: './vehicles-catalogue-page.component.html',
  styleUrl: './vehicles-catalogue-page.component.scss',
})
export class VehiclesCataloguePageComponent implements OnInit {
  private readonly _activatedRoute: ActivatedRoute;
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _isLoading: WritableSignal<boolean>;
  private readonly _query: WritableSignal<VehiclesCatalogueQuery>;
  private readonly _httpClient: HttpClient;

  constructor(activatedRoute: ActivatedRoute, httpClient: HttpClient) {
    this._activatedRoute = activatedRoute;
    this._isLoading = signal(false);
    this._query = signal(BaseVehiclesCatalogueQuery.default());
    this._httpClient = httpClient;
  }

  public ngOnInit(): void {
    this._activatedRoute.params.subscribe((params) => {
      const kindId = params['kindId'] as string;
      const brandId = params['brandId'] as string;
      const modelId = params['modelId'] as string;
      const page = 1;
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
            console.log(data);
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
}
