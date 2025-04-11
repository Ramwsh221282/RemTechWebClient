import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Advertisement } from '../../types/advertisement';
import { NgOptimizedImage } from '@angular/common';
import { Chip } from 'primeng/chip';
import { AnimationsFactory } from '../../../../shared/animations/animations-factory';
import { TransportCataloguePageService } from '../../services/transport-catalogue-page-service';
import { Router, RouterLink } from '@angular/router';

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
  @Input({ required: true }) item: Advertisement = null!;
  private readonly _pageService: TransportCataloguePageService;
  private readonly _router: Router;

  public constructor(
    pageService: TransportCataloguePageService,
    router: Router
  ) {
    this._pageService = pageService;
    this._router = router;
  }

  public showPhotoGallery(event: MouseEvent): void {
    event.stopPropagation();
    this._pageService.selectAdvertisementForPhotoView(this.item);
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
