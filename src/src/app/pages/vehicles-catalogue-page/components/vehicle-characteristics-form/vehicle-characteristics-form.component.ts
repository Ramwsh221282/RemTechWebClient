import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { VehiclesCatalogueCharacteristicsDictionaryEntry } from '../../Models/Catalogue/CatalogueVehicle';
import { Panel } from 'primeng/panel';
import { Select, SelectChangeEvent } from 'primeng/select';
import { InputNumber } from 'primeng/inputnumber';
import { Checkbox } from 'primeng/checkbox';
import {
  VehiclesCatalogueQueryCharacteristic,
  VehiclesCatalogueQueryCharacteristicsList,
} from '../../Models/QueryArguments/QueryArguments';

interface PickingCharacteristics {
  ctxId: string;
  ctxName: string;
  ctxMeasure: string;
  values: PickingCharacteristiccsEntry[];
}

interface PickingCharacteristiccsEntry {
  ctxId: string;
  ctxName: string;
  ctxValue: string;
}

@Component({
  selector: 'app-vehicle-characteristics-form',
  imports: [Panel, Select, InputNumber, Checkbox],
  templateUrl: './vehicle-characteristics-form.component.html',
  styleUrl: './vehicle-characteristics-form.component.scss',
})
export class VehicleCharacteristicsFormComponent {
  @Output()
  characteristicsListChange: EventEmitter<VehiclesCatalogueQueryCharacteristicsList> =
    new EventEmitter();
  private readonly _characteristics: WritableSignal<PickingCharacteristics[]>;
  private readonly _characteristicsList: WritableSignal<VehiclesCatalogueQueryCharacteristicsList>;

  constructor() {
    this._characteristics = signal([]);
    this._characteristicsList = signal(
      new VehiclesCatalogueQueryCharacteristicsList([]),
    );
  }

  @Input({ required: true }) set characteristics_setter(
    value: VehiclesCatalogueCharacteristicsDictionaryEntry[],
  ) {
    this._characteristics.set(this.mapToPickingCharacteristics(value));
  }

  public get characteristics(): PickingCharacteristics[] {
    return this._characteristics();
  }

  public characteristicPicked($event: SelectChangeEvent): void {
    const value = $event.value as PickingCharacteristiccsEntry;
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

  private mapToPickingCharacteristics(
    from: VehiclesCatalogueCharacteristicsDictionaryEntry[],
  ): PickingCharacteristics[] {
    return from.map(
      (
        c: VehiclesCatalogueCharacteristicsDictionaryEntry,
      ): PickingCharacteristics => {
        const measure: string = c.measure;
        const ctxId: string = c.id;
        const ctxName: string = c.name;
        const entries: PickingCharacteristiccsEntry[] = c.values.values.map(
          (val: string): PickingCharacteristiccsEntry => {
            return {
              ctxId: ctxId,
              ctxName: ctxName,
              ctxValue: val,
            };
          },
        );

        return {
          ctxId: ctxId,
          ctxName: ctxName,
          ctxMeasure: measure,
          values: entries,
        };
      },
    );
  }
}
