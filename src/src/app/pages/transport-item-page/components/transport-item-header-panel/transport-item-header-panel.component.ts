import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { Advertisement } from '../../../transport-catalogue-page/types/advertisement';

@Component({
  selector: 'app-transport-item-header-panel',
  imports: [PanelModule],
  templateUrl: './transport-item-header-panel.component.html',
  styleUrl: './transport-item-header-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransportItemHeaderPanelComponent {
  advertisement = input.required<Advertisement>();
}
