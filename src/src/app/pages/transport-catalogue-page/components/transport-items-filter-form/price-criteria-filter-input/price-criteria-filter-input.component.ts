import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputNumberInputEvent, InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-price-criteria-filter-input',
  imports: [InputNumberModule],
  templateUrl: './price-criteria-filter-input.component.html',
  styleUrl: './price-criteria-filter-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceCriteriaFilterInputComponent {
  public constructor() {}

  public handlePriceFromChange(event: InputNumberInputEvent): void {}

  public handlePriceToChange(event: InputNumberInputEvent): void {}

  private getPriceValue(event: InputNumberInputEvent): string {
    const value = event.value ? event.value : '';
    return value as string;
  }
}
