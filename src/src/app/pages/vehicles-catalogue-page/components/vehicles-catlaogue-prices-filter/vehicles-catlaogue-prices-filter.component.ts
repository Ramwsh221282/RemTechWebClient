import {
  Component,
  EventEmitter,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { Checkbox, CheckboxChangeEvent } from 'primeng/checkbox';
import { InputNumber, InputNumberInputEvent } from 'primeng/inputnumber';
import { VehiclesCatalogueQueryPriceSpecification } from '../../Models/QueryArguments/QueryArguments';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-vehicles-catlaogue-prices-filter',
  imports: [Checkbox, InputNumber, FormsModule, Button],
  templateUrl: './vehicles-catlaogue-prices-filter.component.html',
  styleUrl: './vehicles-catlaogue-prices-filter.component.scss',
})
export class VehiclesCatlaoguePricesFilterComponent {
  @Output()
  priceFilterChanged: EventEmitter<VehiclesCatalogueQueryPriceSpecification> =
    new EventEmitter<VehiclesCatalogueQueryPriceSpecification>();
  private readonly _priceFilter: WritableSignal<VehiclesCatalogueQueryPriceSpecification>;
  private readonly _isNds: WritableSignal<boolean>;

  constructor() {
    this._priceFilter = signal(
      new VehiclesCatalogueQueryPriceSpecification(null, null, null),
    );
    this._isNds = signal(false);
  }

  public resetPrice(): void {
    const current: VehiclesCatalogueQueryPriceSpecification =
      this._priceFilter();
    this._priceFilter.set(current.reset());
    this.priceFilterChanged.emit(this._priceFilter());
  }

  public onPriceToInput($event: InputNumberInputEvent): void {
    const value: string | number | null = $event.value;
    const priceFilter: VehiclesCatalogueQueryPriceSpecification =
      this._priceFilter();
    if (!value) {
      this._priceFilter.set(priceFilter.withoutPriceTo());
      return;
    }
    this._priceFilter.set(priceFilter.withEndAt(Number(value)));
    this.priceFilterChanged.emit(this._priceFilter());
  }

  public get isNds(): boolean {
    return this._isNds();
  }

  public onIsNdsCheckBoxClick(): void {
    const currentValue: boolean = this._isNds();
    const otherValue: boolean = !currentValue;
    const priceFilter: VehiclesCatalogueQueryPriceSpecification =
      this._priceFilter();
    this._isNds.set(otherValue);
    this._priceFilter.set(priceFilter.withNdsSpecification(otherValue));
    this.priceFilterChanged.emit(this._priceFilter());
  }

  public onPriceFromInput($event: InputNumberInputEvent): void {
    const value: string | number | null = $event.value;
    const priceFilter: VehiclesCatalogueQueryPriceSpecification =
      this._priceFilter();
    if (!value) {
      this._priceFilter.set(priceFilter.withoutPriceFrom());
      return;
    }
    this._priceFilter.set(priceFilter.withStartFrom(Number(value)));
    this.priceFilterChanged.emit(this._priceFilter());
  }
}
