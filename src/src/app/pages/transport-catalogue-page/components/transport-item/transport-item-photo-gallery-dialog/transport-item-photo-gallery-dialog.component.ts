import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  DialogContainerComponent
} from '../../../../../shared/components/dialog/dialog-container/dialog-container.component';
import {DialogContentComponent} from '../../../../../shared/components/dialog/dialog-content/dialog-content.component';
import {DialogHeaderComponent} from '../../../../../shared/components/dialog/dialog-header/dialog-header.component';
import {DialogFooterComponent} from '../../../../../shared/components/dialog/dialog-footer/dialog-footer.component';
import {Button} from 'primeng/button';
import {GalleriaModule} from 'primeng/galleria';
import {NgOptimizedImage} from '@angular/common';
import {Advertisement} from '../../../types/advertisement';

@Component({
  selector: 'app-transport-item-photo-gallery-dialog',
  imports: [
    DialogContainerComponent,
    DialogContentComponent,
    DialogHeaderComponent,
    DialogFooterComponent,
    Button,
    GalleriaModule,
    NgOptimizedImage
  ],
  templateUrl: './transport-item-photo-gallery-dialog.component.html',
  styleUrl: './transport-item-photo-gallery-dialog.component.scss'
})
export class TransportItemPhotoGalleryDialogComponent {
  @Input({required: true}) advertisement: Advertisement | null = null!;
  @Input({required: true}) visibility: boolean = false;
  @Input({required: true}) header: string = ''
  @Input({required: true}) photos: string[] = [];
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

  public closeDialog($event: MouseEvent) {
    $event.stopPropagation();
    this.onClose.emit();
  }
}
