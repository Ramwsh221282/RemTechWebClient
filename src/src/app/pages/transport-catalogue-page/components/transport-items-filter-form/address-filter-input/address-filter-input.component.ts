import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-address-filter-input',
  imports: [InputTextModule, FormsModule],
  templateUrl: './address-filter-input.component.html',
  styleUrl: './address-filter-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFilterInputComponent {
  public addressInput: string = '';

  public constructor() {}

  public handleAddressChange(event: string): void {}
}
