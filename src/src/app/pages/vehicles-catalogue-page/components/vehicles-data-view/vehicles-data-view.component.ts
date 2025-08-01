import { Component, Input, signal, WritableSignal } from '@angular/core';
import { CatalogueVehicle } from '../../Models/Catalogue/CatalogueVehicle';
import { DataView } from 'primeng/dataview';
import { NgForOf, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-vehicles-data-view',
  imports: [DataView, NgForOf, NgOptimizedImage],
  templateUrl: './vehicles-data-view.component.html',
  styleUrl: './vehicles-data-view.component.scss',
})
export class VehiclesDataViewComponent {
  @Input({ required: true }) set vehicles_setter(value: CatalogueVehicle[]) {
    this._vehicles.set(value);
  }

  private readonly _vehicles: WritableSignal<CatalogueVehicle[]>;
  constructor() {
    this._vehicles = signal([]);
  }

  public get vehicles(): CatalogueVehicle[] {
    return this._vehicles();
  }
}
