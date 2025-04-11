import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { TransportItemFacadeService } from '../../services/transport-item-facade.service';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@Component({
  selector: 'app-transport-item-description-block',
  imports: [PanelModule, ScrollPanelModule],
  templateUrl: './transport-item-description-block.component.html',
  styleUrl: './transport-item-description-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransportItemDescriptionBlockComponent {
  private readonly _service: TransportItemFacadeService;

  public constructor(service: TransportItemFacadeService) {
    this._service = service;
  }

  public get description(): string {
    return this._service.transport.description;
  }
}
