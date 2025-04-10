import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogContainerComponent } from '../../../../../shared/components/dialog/dialog-container/dialog-container.component';
import { DialogContentComponent } from '../../../../../shared/components/dialog/dialog-content/dialog-content.component';
import { DialogHeaderComponent } from '../../../../../shared/components/dialog/dialog-header/dialog-header.component';
import { DialogFooterComponent } from '../../../../../shared/components/dialog/dialog-footer/dialog-footer.component';
import { Button } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { NgOptimizedImage } from '@angular/common';
import { Advertisement } from '../../../types/advertisement';
import { TransportCataloguePageService } from '../../../services/transport-catalogue-page-service';

@Component({
  selector: 'app-transport-item-photo-gallery-dialog',
  imports: [
    DialogContainerComponent,
    DialogContentComponent,
    DialogHeaderComponent,
    DialogFooterComponent,
    Button,
    GalleriaModule,
    NgOptimizedImage,
  ],
  templateUrl: './transport-item-photo-gallery-dialog.component.html',
  styleUrl: './transport-item-photo-gallery-dialog.component.scss',
})
export class TransportItemPhotoGalleryDialogComponent {
  @Input({ required: true }) visibility: boolean = false;
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

  private readonly _cataloguePageService: TransportCataloguePageService;

  public constructor(cataloguePageService: TransportCataloguePageService) {
    this._cataloguePageService = cataloguePageService;
  }

  public get advertisement(): Advertisement | null {
    return this._cataloguePageService.selectedAdvertisementForPhotoView;
  }

  public mapPhotos(advertisement: Advertisement): string[] {
    return advertisement.photos.map((p) => {
      const source = p.sourceUrl;
      return source;
    });
  }

  public getHeader(advertisement: Advertisement): string {
    return advertisement.title;
  }

  public closeDialog($event: MouseEvent) {
    $event.stopPropagation();
    this.onClose.emit();
  }
}
