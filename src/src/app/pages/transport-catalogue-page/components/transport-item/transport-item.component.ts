import {Component, EventEmitter, Input, Output, signal, WritableSignal} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Advertisement } from '../../types/advertisement';
import {NgOptimizedImage} from '@angular/common';
import {Chip} from 'primeng/chip';
import {AnimationsFactory} from '../../../../shared/animations/animations-factory';
import {
  TransportItemPhotoGalleryDialogComponent
} from './transport-item-photo-gallery-dialog/transport-item-photo-gallery-dialog.component';

@Component({
  selector: 'app-transport-item',
  imports: [CardModule, ButtonModule, NgOptimizedImage, Chip, TransportItemPhotoGalleryDialogComponent],
  templateUrl: './transport-item.component.html',
  styleUrl: './transport-item.component.scss',
  animations: [AnimationsFactory.fadeInAnimation('0.5s ease-in'), AnimationsFactory.fadeOutAnimation('0.5s ease-in')]
})
export class TransportItemComponent {
  @Input({ required: true }) item: Advertisement = null!;
  @Output() showPhotoGallery: EventEmitter<Advertisement> = new EventEmitter<Advertisement>();
  private readonly _photoGalleryEnabled: WritableSignal<boolean> = signal(false);
  public updatePhotoGalleryVisibility(state: boolean): void {
    this._photoGalleryEnabled.set(state);
  }

  public formatItemCharacteristics(): string {
    return (
      this.item.characteristics
        .map((c) => `${c.name} ${c.value}`)
        .join(', ')
        .trim() + '.'
    );
  }
}
