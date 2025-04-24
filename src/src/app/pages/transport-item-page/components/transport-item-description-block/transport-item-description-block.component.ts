import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { Advertisement } from '../../../transport-catalogue-page/types/advertisement';

@Component({
  selector: 'app-transport-item-description-block',
  imports: [PanelModule, ScrollPanelModule],
  templateUrl: './transport-item-description-block.component.html',
  styleUrl: './transport-item-description-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransportItemDescriptionBlockComponent {
  advertisement = input.required<Advertisement>();
}
