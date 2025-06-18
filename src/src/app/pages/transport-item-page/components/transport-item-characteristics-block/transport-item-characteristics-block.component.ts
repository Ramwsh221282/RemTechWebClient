import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ButtonModule } from 'primeng/button';
import { Advertisement } from '../../../transport-catalogue-page/types/advertisement';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-transport-item-characteristics-block',
  imports: [ScrollPanelModule, PanelModule, ButtonModule, DecimalPipe],
  templateUrl: './transport-item-characteristics-block.component.html',
  styleUrl: './transport-item-characteristics-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransportItemCharacteristicsBlockComponent {
  advertisement = input.required<Advertisement>();

  public navigateOnSourceClick($event: MouseEvent): void {
    $event.stopPropagation();
    window.open(this.advertisement().sourceUrl);
  }
}
