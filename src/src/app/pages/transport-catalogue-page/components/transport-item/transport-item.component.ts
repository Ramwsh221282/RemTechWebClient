import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import {
  Advertisement,
  AdvertisementsFactory,
} from '../../types/advertisement';
import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { Chip } from 'primeng/chip';
import { AnimationsFactory } from '../../../../shared/animations/animations-factory';

@Component({
  selector: 'app-transport-item',
  imports: [CardModule, ButtonModule, NgOptimizedImage, Chip, DecimalPipe],
  templateUrl: './transport-item.component.html',
  styleUrl: './transport-item.component.scss',
  animations: [
    AnimationsFactory.fadeInAnimation('0.5s ease-in'),
    AnimationsFactory.fadeOutAnimation('0.5s ease-in'),
  ],
})
export class TransportItemComponent {
  @Output() selectAdvertisementPhoto: EventEmitter<Advertisement>;
  @Output() advertisementDetailsNavigationInvoked: EventEmitter<Advertisement>;
  @Input({ required: true }) item: Advertisement;

  public constructor() {
    this.selectAdvertisementPhoto = new EventEmitter();
    this.item = AdvertisementsFactory.empty();
    this.advertisementDetailsNavigationInvoked = new EventEmitter();
  }

  public showPhotoGallery(event: MouseEvent): void {
    event.stopPropagation();
    this.selectAdvertisementPhoto.emit(this.item);
  }

  public formatItemCharacteristics(): string {
    return (
      this.item.characteristics
        .map((c) => `${c.name} ${c.value}`)
        .join(', ')
        .trim() + '.'
    );
  }

  public get itemHref(): string {
    return `transport-catalogue/categories/${this.item.categoryId}/brands/${this.item.brandId}/transports/${this.item.id}`;
  }
}
