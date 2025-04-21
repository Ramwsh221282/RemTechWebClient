import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import {
  Advertisement,
  AdvertisementsFactory,
} from '../../types/advertisement';
import { NgOptimizedImage } from '@angular/common';
import { Chip } from 'primeng/chip';
import { AnimationsFactory } from '../../../../shared/animations/animations-factory';

@Component({
  selector: 'app-transport-item',
  imports: [CardModule, ButtonModule, NgOptimizedImage, Chip],
  templateUrl: './transport-item.component.html',
  styleUrl: './transport-item.component.scss',
  animations: [
    AnimationsFactory.fadeInAnimation('0.5s ease-in'),
    AnimationsFactory.fadeOutAnimation('0.5s ease-in'),
  ],
})
export class TransportItemComponent {
  @Input({ required: true }) item: Advertisement =
    AdvertisementsFactory.empty();

  public constructor() {}

  public showPhotoGallery(event: MouseEvent): void {
    // event.stopPropagation();
    // this._pageService.selectAdvertisementForPhotoView(this.item);
  }

  public formatItemCharacteristics(): string {
    return (
      this.item.characteristics
        .map((c) => `${c.name} ${c.value}`)
        .join(', ')
        .trim() + '.'
    );
  }

  public navigateTransportPage($event: MouseEvent): void {
    $event.stopPropagation();
  }

  public get itemHref(): string {
    return `transport-catalogue/transport/${this.item.id}`;
  }
}
