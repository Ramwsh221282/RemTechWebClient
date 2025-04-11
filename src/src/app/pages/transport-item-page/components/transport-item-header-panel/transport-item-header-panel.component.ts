import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TransportItemFacadeService } from '../../services/transport-item-facade.service';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-transport-item-header-panel',
  imports: [PanelModule],
  templateUrl: './transport-item-header-panel.component.html',
  styleUrl: './transport-item-header-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransportItemHeaderPanelComponent {
  private readonly _service: TransportItemFacadeService;

  public constructor(service: TransportItemFacadeService) {
    this._service = service;
  }

  public get title(): string {
    return this._service.transport.title;
  }
}
