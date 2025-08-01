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
import { Select, SelectChangeEvent } from 'primeng/select';
import {
  VehicleRegion,
  VehicleRegionsSource,
} from '../../types/VehicleRegions';
import { StringUtils } from '../../../../shared/utils/string-utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VehiclesCatalogueQueryLocationId } from '../../Models/QueryArguments/QueryArguments';

@Component({
  selector: 'app-vehicles-catalogue-regions-select',
  imports: [Select],
  templateUrl: './vehicles-catalogue-regions-select.component.html',
  styleUrl: './vehicles-catalogue-regions-select.component.scss',
})
export class VehiclesCatalogueRegionsSelectComponent {
  @Output() regionChange: EventEmitter<VehiclesCatalogueQueryLocationId> =
    new EventEmitter<VehiclesCatalogueQueryLocationId>();

  private readonly _kindId: WritableSignal<string>;
  private readonly _brandId: WritableSignal<string>;
  private readonly _modelId: WritableSignal<string>;
  private readonly _regions: WritableSignal<VehicleRegion[]>;
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  constructor(source: VehicleRegionsSource) {
    this._kindId = signal('');
    this._brandId = signal('');
    this._modelId = signal('');
    this._regions = signal([]);
    effect((): void => {
      const kindId: string = this._kindId();
      const brandId: string = this._brandId();
      const modelId: string = this._modelId();
      if (StringUtils.anyEmpty([kindId, brandId, modelId])) return;
      source
        .fetch(kindId, brandId, modelId)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (regions: VehicleRegion[]): void => {
            const defaultRegion: VehicleRegion = {
              name: 'Любой',
              kind: '',
              id: '',
            };
            this._regions.set([defaultRegion, ...regions]);
          },
        });
    });
  }

  public regionSelected($event: SelectChangeEvent): void {
    const region: VehicleRegion = $event.value as VehicleRegion;
    if (region.name === 'Любой') {
      this.regionChange.emit(new VehiclesCatalogueQueryLocationId(null));
      return;
    }
    this.regionChange.emit(new VehiclesCatalogueQueryLocationId(region.id));
  }

  public get regions(): VehicleRegion[] {
    return this._regions();
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
}
