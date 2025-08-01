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
import { Panel } from 'primeng/panel';
import { Select, SelectChangeEvent } from 'primeng/select';
import { InputNumber } from 'primeng/inputnumber';
import { Checkbox } from 'primeng/checkbox';
import {
  VehiclesCatalogueQueryCharacteristic,
  VehiclesCatalogueQueryCharacteristicsList,
} from '../../Models/QueryArguments/QueryArguments';
import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import {
  VehicleCharacteristic,
  VehicleCharacteristicsSource,
  VehicleCharacteristicValue,
} from '../../types/VehicleCharacteristics';
import { StringUtils } from '../../../../shared/utils/string-utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIf } from '@angular/common';

interface PickingCharacteristics {
  ctxId: string;
  ctxName: string;
  ctxMeasure: string;
  values: PickingCharacteristicsEntry[];
  selectedValue?: PickingCharacteristicsEntry | null;
}

interface PickingCharacteristicsEntry {
  ctxId: string;
  ctxName: string;
  ctxValue: string;
}

@Component({
  selector: 'app-vehicle-characteristics-form',
  imports: [Panel, Select, InputNumber, Checkbox, Button, FormsModule, NgIf],
  templateUrl: './vehicle-characteristics-form.component.html',
  styleUrl: './vehicle-characteristics-form.component.scss',
})
export class VehicleCharacteristicsFormComponent {
  @Output()
  characteristicsListChange: EventEmitter<VehiclesCatalogueQueryCharacteristicsList> =
    new EventEmitter();
  private readonly _characteristics: WritableSignal<PickingCharacteristics[]>;
  private readonly _kindId: WritableSignal<string>;
  private readonly _modelId: WritableSignal<string>;
  private readonly _brandId: WritableSignal<string>;
  private readonly _characteristicsList: WritableSignal<VehiclesCatalogueQueryCharacteristicsList>;
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  constructor(source: VehicleCharacteristicsSource) {
    this._characteristics = signal([]);
    this._characteristicsList = signal(
      new VehiclesCatalogueQueryCharacteristicsList([]),
    );
    this._kindId = signal('');
    this._brandId = signal('');
    this._modelId = signal('');
    effect(() => {
      const kindId = this._kindId();
      const brandId: string = this._brandId();
      const modelId: string = this._modelId();
      if (
        StringUtils.isEmptyOrWhiteSpace(kindId) ||
        StringUtils.isEmptyOrWhiteSpace(brandId) ||
        StringUtils.isEmptyOrWhiteSpace(modelId)
      )
        return;
      source
        .fetch(kindId, brandId, modelId)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (data: VehicleCharacteristic[]): void => {
            this._characteristics.set(this.mapToPickingCharacteristics(data));
          },
        });
    });
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

  public get characteristics(): PickingCharacteristics[] {
    return this._characteristics();
  }

  public characteristicPicked($event: SelectChangeEvent): void {
    const value = $event.value as PickingCharacteristicsEntry;
    const characteristics: PickingCharacteristics[] = this._characteristics();
    const index: number = characteristics.findIndex(
      (c: PickingCharacteristics): boolean => c.ctxId === value.ctxId,
    );
    if (index < 0) return;
    const updatedCharacteristics: PickingCharacteristics[] = [
      ...characteristics,
    ];
    updatedCharacteristics[index].selectedValue = { ...value };
    this._characteristics.set(updatedCharacteristics);
    const queryCtx: VehiclesCatalogueQueryCharacteristic =
      new VehiclesCatalogueQueryCharacteristic(
        value.ctxId,
        value.ctxName,
        value.ctxValue,
      );
    const currentList: VehiclesCatalogueQueryCharacteristicsList =
      this._characteristicsList();
    const listWithItem: VehiclesCatalogueQueryCharacteristicsList =
      currentList.accept(queryCtx);
    this._characteristicsList.set(listWithItem);
    this.characteristicsListChange.emit(listWithItem);
  }

  public clearSelection(ctxId: string, event: Event): void {
    event.stopPropagation();
    const characteristics: PickingCharacteristics[] = this._characteristics();
    const index: number = characteristics.findIndex(
      (c: PickingCharacteristics): boolean => c.ctxId === ctxId,
    );
    if (index < 0) return;
    const updatedCharacteristics: PickingCharacteristics[] = [
      ...characteristics,
    ];
    updatedCharacteristics[index] = {
      ...updatedCharacteristics[index],
      selectedValue: null,
    };
    this._characteristics.set(updatedCharacteristics);
    const currentList: VehiclesCatalogueQueryCharacteristicsList =
      this._characteristicsList();
    const listWithoutItem: VehiclesCatalogueQueryCharacteristicsList =
      currentList.removeById(ctxId);
    this._characteristicsList.set(listWithoutItem);
    this.characteristicsListChange.emit(listWithoutItem);
  }

  private mapToPickingCharacteristics(
    from: VehicleCharacteristic[],
  ): PickingCharacteristics[] {
    return from.map((c: VehicleCharacteristic): PickingCharacteristics => {
      const measure: string = c.measure;
      const ctxId: string = c.id;
      const ctxName: string = c.name;
      const entries: PickingCharacteristicsEntry[] = c.values.map(
        (val: VehicleCharacteristicValue): PickingCharacteristicsEntry => {
          return {
            ctxId: ctxId,
            ctxName: ctxName,
            ctxValue: val.value,
          };
        },
      );

      return {
        ctxId: ctxId,
        ctxName: ctxName,
        ctxMeasure: measure,
        values: entries,
      };
    });
  }
}
