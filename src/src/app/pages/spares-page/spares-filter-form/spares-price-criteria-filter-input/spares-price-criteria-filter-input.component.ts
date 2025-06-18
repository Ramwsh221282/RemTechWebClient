import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { InputNumberInputEvent, InputNumberModule } from 'primeng/inputnumber';
import { Button } from 'primeng/button';
import { Chip } from 'primeng/chip';
import { FormsModule } from '@angular/forms';
import { PriceFromPayload, PriceToPayload, SparePriceRangePayload } from '../../types/spare-price-range-payload';

@Component({
  selector: 'app-spares-price-criteria-filter-input',
  imports: [FormsModule, Button, Chip, InputNumberModule],
  templateUrl: './spares-price-criteria-filter-input.component.html',
  styleUrl: './spares-price-criteria-filter-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SparesPriceCriteriaFilterInputComponent {
  @Output() priceRangeEvent: EventEmitter<SparePriceRangePayload | null>
  public chipLabel: string = 'Цена от и до:';
  public chipWidth: string = 'auto';

  public priceFromValue: string | number | null;
  public priceToValue: string | number | null;

  constructor() {
    this.priceRangeEvent = new EventEmitter();
    this.priceFromValue = null;
    this.priceToValue = null;
  }

  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.updateChipLabel();
  }

  public updateChipLabel() {
    if (window.innerWidth < 900) {
      this.chipLabel = '';
      this.chipWidth = '40px';
      return;
    }
    this.chipLabel = 'Указать характеристику';
    this.chipWidth = 'auto';
    return;
  }

  public handlePriceFromChange($event: InputNumberInputEvent): void {
    const value: string | number | null = $event.value;
    if (value === null) {
      this.priceFromValue = null;
      return;
    }
    this.priceFromValue = value;
  }

  public handlePriceToChange($event: InputNumberInputEvent): void {
    const value: string | number | null = $event.value;
    if (value === null) {
      this.priceToValue = null;
      return;
    }
    this.priceToValue = value;
  }

  public flushPrices($event: MouseEvent): void {
    $event.stopPropagation();
    this.priceFromValue = null;
    this.priceToValue = null;
    this.priceRangeEvent.emit(null);
  }

  public applyPrices($event: MouseEvent): void {
    $event.stopPropagation();
    const priceFrom: PriceFromPayload | null = this.priceFromValue === null ? null : { from: this.priceFromValue as number }
    const priceTo: PriceToPayload | null = this.priceToValue === null ? null : { to: this.priceToValue as number }
    if (priceFrom == null && priceTo === null) {
      this.priceRangeEvent.emit(null);
      return;
    }
    const priceRangePayload: SparePriceRangePayload = { From: priceFrom, To: priceTo }
    this.priceRangeEvent.emit(priceRangePayload);
  }
}
