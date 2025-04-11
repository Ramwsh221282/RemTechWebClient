import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { PanelModule } from 'primeng/panel';
import { TransportItemFacadeService } from '../../services/transport-item-facade.service';

@Component({
  selector: 'app-transport-item-photo-block',
  imports: [GalleriaModule, NgOptimizedImage, PanelModule],
  templateUrl: './transport-item-photo-block.component.html',
  styleUrl: './transport-item-photo-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransportItemPhotoBlockComponent {
  private readonly _service: TransportItemFacadeService;

  public constructor(service: TransportItemFacadeService) {
    this._service = service;
  }

  public get photos(): string[] {
    const transport = this._service.transport;
    const photos = transport.photos;
    return photos.map((p) => {
      return p.sourceUrl;
    });
  }
}
