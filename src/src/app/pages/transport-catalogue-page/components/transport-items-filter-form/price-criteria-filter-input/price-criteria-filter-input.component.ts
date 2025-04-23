import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { InputNumberInputEvent, InputNumberModule } from 'primeng/inputnumber';
import { Button } from 'primeng/button';
import { Chip } from 'primeng/chip';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-price-criteria-filter-input',
  imports: [InputNumberModule, Button, Chip, FormsModule],
  templateUrl: './price-criteria-filter-input.component.html',
  styleUrl: './price-criteria-filter-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceCriteriaFilterInputComponent {
  @Input({ required: true }) priceToValue: string = '';
  @Input({ required: true }) priceFromValue: string = '';
  @Output() priceFromChange: EventEmitter<string>;
  @Output() priceToChange: EventEmitter<string>;
  @Output() priceFilterApplied: EventEmitter<void>;
  @Output() priceFilterFlushed: EventEmitter<void>;

  public constructor() {
    this.priceFromChange = new EventEmitter<string>();
    this.priceToChange = new EventEmitter<string>();
    this.priceFilterApplied = new EventEmitter<void>();
    this.priceFilterFlushed = new EventEmitter<void>();
  }

  public chipLabel: string = 'Цена от и до:';
  public chipWidth: string = 'auto';

  public handlePriceFromChange(event: InputNumberInputEvent): void {
    this.priceFromChange.emit(this.getPriceValue(event));
  }

  public handlePriceToChange(event: InputNumberInputEvent): void {
    this.priceToChange.emit(this.getPriceValue(event));
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

  private getPriceValue(event: InputNumberInputEvent): string {
    const value = event.value ? event.value : '';
    return value as string;
  }

  public applyPriceFilter(): void {
    this.priceFilterApplied.emit();
  }

  public flushPriceFilter(): void {
    this.priceFromChange.emit('');
    this.priceToChange.emit('');
    this.priceFilterFlushed.emit();
  }
}
