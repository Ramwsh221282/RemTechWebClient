import { Component, Input, signal, WritableSignal } from '@angular/core';
import { VehiclesCatalogueCharacteristicsDictionaryEntry } from '../../Models/Catalogue/CatalogueVehicle';
import { Panel } from 'primeng/panel';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-vehicle-characteristics-form',
  imports: [Panel, Select],
  templateUrl: './vehicle-characteristics-form.component.html',
  styleUrl: './vehicle-characteristics-form.component.scss',
})
export class VehicleCharacteristicsFormComponent {
  private readonly _characteristics: WritableSignal<
    VehiclesCatalogueCharacteristicsDictionaryEntry[]
  >;

  constructor() {
    this._characteristics = signal([]);
  }

  @Input({ required: true }) set characteristics_setter(
    value: VehiclesCatalogueCharacteristicsDictionaryEntry[],
  ) {
    this._characteristics.set(value);
  }

  public get characteristics(): VehiclesCatalogueCharacteristicsDictionaryEntry[] {
    return this._characteristics();
  }
}
