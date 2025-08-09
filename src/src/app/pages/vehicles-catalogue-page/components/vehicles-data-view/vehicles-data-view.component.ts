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
import { CatalogueVehicle } from '../../types/CatalogueVehicle';
import { DataView } from 'primeng/dataview';
import { NgForOf } from '@angular/common';
import {
  BaseVehiclesCatalogueQuery,
  VehiclesCatalogueQuery,
} from '../../Models/Query/VehiclesCatalogueQuery';
import { HttpClient } from '@angular/common/http';
import { StringUtils } from '../../../../shared/utils/string-utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Badge } from 'primeng/badge';
import { Paginator } from 'primeng/paginator';
import { VehiclesCatalogueAggregatedDataGridComponent } from '../vehicles-catalogue-aggregated-data-grid/vehicles-catalogue-aggregated-data-grid.component';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { VehiclesCatalogueTextSearchQuery } from '../../Models/QueryArguments/QueryArguments';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehicles-data-view',
  imports: [DataView, NgForOf, Badge, InputText, Button, ReactiveFormsModule],
  templateUrl: './vehicles-data-view.component.html',
  styleUrl: './vehicles-data-view.component.scss',
})
export class VehiclesDataViewComponent {
  @Output() textSearchChange: EventEmitter<VehiclesCatalogueTextSearchQuery> =
    new EventEmitter<VehiclesCatalogueTextSearchQuery>();
  public readonly textSearchForm: FormGroup = new FormGroup({
    term: new FormControl(''),
  });
  private readonly _kindId: WritableSignal<string>;
  private readonly _modelId: WritableSignal<string>;
  private readonly _brandId: WritableSignal<string>;
  private readonly _query: WritableSignal<VehiclesCatalogueQuery>;
  private readonly _vehicles: WritableSignal<CatalogueVehicle[]>;
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  constructor(httpClient: HttpClient) {
    this._vehicles = signal([]);
    this._kindId = signal('');
    this._brandId = signal('');
    this._modelId = signal('');
    this._query = signal(BaseVehiclesCatalogueQuery.default());
    effect((): void => {
      const kindId: string = this._kindId();
      const brandId: string = this._brandId();
      const modelId: string = this._modelId();
      if (
        StringUtils.isEmptyOrWhiteSpace(kindId) ||
        StringUtils.isEmptyOrWhiteSpace(modelId) ||
        StringUtils.isEmptyOrWhiteSpace(brandId)
      )
        return;
      const query: VehiclesCatalogueQuery = this._query();
      query
        .query(kindId, brandId, modelId, httpClient)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (data: CatalogueVehicle[]): void => {
            this._vehicles.set(data);
          },
        });
    });
  }

  public itemNdsString(item: CatalogueVehicle): string {
    if (item.price.isNds) return 'с НДС';
    return 'без НДС';
  }

  public textSearchSubmit(): void {
    const formValues = this.textSearchForm.value;
    const searchTerm: string = formValues.term as string;
    if (StringUtils.isEmptyOrWhiteSpace(searchTerm)) {
      this.textSearchChange.emit(new VehiclesCatalogueTextSearchQuery(null));
      return;
    }
    this.textSearchChange.emit(
      new VehiclesCatalogueTextSearchQuery(searchTerm),
    );
  }

  @Input({ required: true }) set kind_id_setter(value: string) {
    this._kindId.set(value);
  }

  @Input({ required: true }) set brand_id_setter(value: string) {
    this._brandId.set(value);
  }

  @Input({ required: true }) set model_id_setter(value: string) {
    this._modelId.set(value);
  }

  @Input({ required: true }) set query_setter(value: VehiclesCatalogueQuery) {
    this._query.set(value);
  }

  public get vehicles(): CatalogueVehicle[] {
    return this._vehicles();
  }
}
