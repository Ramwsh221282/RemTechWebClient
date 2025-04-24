import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { PanelModule } from 'primeng/panel';
import { Advertisement } from '../../../transport-catalogue-page/types/advertisement';

@Component({
  selector: 'app-transport-item-photo-block',
  imports: [GalleriaModule, NgOptimizedImage, PanelModule],
  templateUrl: './transport-item-photo-block.component.html',
  styleUrl: './transport-item-photo-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransportItemPhotoBlockComponent {
  advertisement = input.required<Advertisement>();
}
