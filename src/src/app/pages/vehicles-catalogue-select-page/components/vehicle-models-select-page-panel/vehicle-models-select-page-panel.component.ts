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
import { VehicleBrand } from '../../data/types/vehiclebrands';
import { VehicleModel } from '../../data/types/vehiclemodel';
import { VehicleKind } from '../../data/types/vehiclekind';
import { ApiVehicleModelsSource } from '../../data/sources/apivehiclemodelssource';
import { finalize } from 'rxjs';
import { DataView } from 'primeng/dataview';
import { NgForOf } from '@angular/common';
import { Panel } from 'primeng/panel';
import { ScrollPanel } from 'primeng/scrollpanel';
import { Tag } from 'primeng/tag';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-vehicle-models-select-page-panel',
  imports: [DataView, NgForOf, Panel, ScrollPanel, Tag, Button],
  templateUrl: './vehicle-models-select-page-panel.component.html',
  styleUrl: './vehicle-models-select-page-panel.component.scss',
})
export class VehicleModelsSelectPagePanelComponent {
  private readonly _brand: WritableSignal<VehicleBrand | null>;
  private readonly _kind: WritableSignal<VehicleKind | null>;
  private readonly _models: WritableSignal<VehicleModel[]>;
  private readonly _isLoading: WritableSignal<boolean>;
  private readonly _destroyRef = inject(DestroyRef);

  @Output() modelSelected: EventEmitter<VehicleModel> = new EventEmitter();

  @Input({ required: true }) set brand_setter(value: VehicleBrand) {
    this._brand.set(value);
  }

  @Input({ required: true }) set kind_setter(value: VehicleKind) {
    this._kind.set(value);
  }

  constructor(modelsSource: ApiVehicleModelsSource) {
    this._brand = signal(null);
    this._kind = signal(null);
    this._models = signal([]);
    this._isLoading = signal(false);
    effect(() => {
      const kind: VehicleKind | null = this._kind();
      const brand: VehicleBrand | null = this._brand();
      if (!kind || !brand) {
        this._models.set([]);
        return;
      }
      modelsSource
        .retrieve(kind, brand)
        .pipe(
          takeUntilDestroyed(this._destroyRef),
          finalize(() => {
            this._isLoading.set(false);
          }),
        )
        .subscribe({
          next: (data: VehicleModel[]) => this._models.set(data),
          error: (_: Error) => this._models.set([]),
        });
    });
  }

  public get isLoading(): boolean {
    return this._isLoading();
  }

  public get brandName(): string {
    const brand: VehicleBrand | null = this._brand();
    return brand === null ? '' : brand.name;
  }

  public get kindName(): string {
    const kind: VehicleKind | null = this._kind();
    return kind === null ? '' : kind.name;
  }

  public get models(): VehicleModel[] {
    return this._models();
  }

  public selectModel(model: VehicleModel): void {
    this.modelSelected.emit(model);
  }
}
