import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { VehicleKind } from '../../data/types/vehiclekind';
import { VehicleModel } from '../../data/types/vehiclemodel';
import { VehicleBrand } from '../../data/types/vehiclebrands';

@Component({
  selector: 'app-go-to-vehicle-catalogue-dialog',
  imports: [Dialog, Button],
  templateUrl: './go-to-vehicle-catalogue-dialog.component.html',
  styleUrl: './go-to-vehicle-catalogue-dialog.component.scss',
})
export class GoToVehicleCatalogueDialogComponent {
  @Output() changeParameterClicked: EventEmitter<void> = new EventEmitter();
  @Output() goToCatalogueClicked: EventEmitter<void> = new EventEmitter();
  @Input({ required: true }) set visibility_setter(value: boolean) {
    this._visibility.set(value);
  }

  @Input({ required: true }) set kind_setter(value: VehicleKind | null) {
    const name = value ? value.name : '';
    this._kindName.set(name);
  }

  @Input({ required: true }) set brand_setter(value: VehicleBrand) {
    const name = value ? value.name : '';
    this._brandName.set(name);
  }

  private readonly _visibility: WritableSignal<boolean>;
  private readonly _kindName: WritableSignal<string>;
  private readonly _brandName: WritableSignal<string>;

  constructor() {
    this._visibility = signal(false);
    this._kindName = signal('');
    this._brandName = signal('');
  }

  public get kindName(): string {
    return this._kindName();
  }

  public get brandName(): string {
    return this._brandName();
  }

  public get visibility(): boolean {
    return this._visibility();
  }

  public changeParametersClick(): void {
    this.changeParameterClicked.emit();
  }

  public goToCatalogueClick(): void {
    this.goToCatalogueClicked.emit();
  }
}
