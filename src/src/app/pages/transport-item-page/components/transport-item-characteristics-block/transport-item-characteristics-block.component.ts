import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TransportItemFacadeService } from '../../services/transport-item-facade.service';
import {
  TransportItem,
  TransportItemCharacteristic,
} from '../../types/transport-item';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-transport-item-characteristics-block',
  imports: [ScrollPanelModule, PanelModule, ButtonModule],
  templateUrl: './transport-item-characteristics-block.component.html',
  styleUrl: './transport-item-characteristics-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransportItemCharacteristicsBlockComponent {
  private readonly _service: TransportItemFacadeService;

  public constructor(service: TransportItemFacadeService) {
    this._service = service;
  }

  public get characteristics(): TransportItemCharacteristic[] {
    return this._service.transport.characteristics;
  }

  public get transport(): TransportItem {
    return this._service.transport;
  }
}
