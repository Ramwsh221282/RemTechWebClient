import { Component, signal, WritableSignal } from '@angular/core';
import { VehicleKindsSelectPagePanelComponent } from './components/vehicle-kinds-select-page-panel/vehicle-kinds-select-page-panel.component';
import { VehicleKind } from './data/types/vehiclekind';
import { VehicleBrand } from './data/types/vehiclebrands';
import { VehicleBrandsSelectPagePanelComponent } from './components/vehicle-brands-select-page-panel/vehicle-brands-select-page-panel.component';
import { NgIf } from '@angular/common';
import { VehicleModelsSelectPagePanelComponent } from './components/vehicle-models-select-page-panel/vehicle-models-select-page-panel.component';

@Component({
  selector: 'app-vehicles-catalogue-select-page',
  imports: [
    VehicleKindsSelectPagePanelComponent,
    VehicleBrandsSelectPagePanelComponent,
    NgIf,
    VehicleModelsSelectPagePanelComponent,
  ],
  templateUrl: './vehicles-catalogue-select-page.component.html',
  styleUrl: './vehicles-catalogue-select-page.component.scss',
})
export class VehiclesCatalogueSelectPageComponent {
  private readonly _selectedVehicleKind: WritableSignal<VehicleKind | null>;
  private readonly _selectedVehicleBrand: WritableSignal<VehicleBrand | null>;

  constructor() {
    this._selectedVehicleKind = signal(null);
    this._selectedVehicleBrand = signal(null);
  }

  public get kindSelected(): boolean {
    return this._selectedVehicleKind() !== null;
  }

  public get brandSelected(): boolean {
    return this._selectedVehicleBrand() !== null;
  }

  public get currentBrand(): VehicleBrand {
    const brand: VehicleBrand | null = this._selectedVehicleBrand();
    if (!brand) throw new Error('Brand not specified');
    return brand;
  }

  public get currentKind(): VehicleKind {
    const kind: VehicleKind | null = this._selectedVehicleKind();
    if (!kind) throw new Error('Kind not specified');
    return kind;
  }

  public acceptSelectedVehicleBrand(brand: VehicleBrand): void {
    this._selectedVehicleBrand.set(brand);
  }

  public acceptSelectedVehicleKind(vehicleKind: VehicleKind): void {
    const currentKind: VehicleKind | null = this._selectedVehicleKind();
    if (currentKind) this._selectedVehicleKind.set(null);
    this._selectedVehicleKind.set(vehicleKind);
  }
}
