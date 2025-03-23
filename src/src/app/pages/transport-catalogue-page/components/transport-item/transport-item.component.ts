import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Advertisement } from '../../types/advertisement';

@Component({
  selector: 'app-transport-item',
  imports: [CardModule, ButtonModule],
  templateUrl: './transport-item.component.html',
  styleUrl: './transport-item.component.scss',
})
export class TransportItemComponent {
  @Input({ required: true }) item: Advertisement = null!;

  public formatItemCharacteristics(): string {
    return (
      this.item.characteristics
        .map((c) => `${c.name} ${c.value}`)
        .join(', ')
        .trim() + '.'
    );
  }
}
