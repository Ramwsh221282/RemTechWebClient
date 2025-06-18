import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { SpareViewModel } from '../types/spare-viewmodel';
import { NgOptimizedImage } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';
import { Button } from 'primeng/button';
import { DialogFooterComponent } from '../../../shared/components/dialog/dialog-footer/dialog-footer.component';
import { DialogHeaderComponent } from '../../../shared/components/dialog/dialog-header/dialog-header.component';
import { DialogContentComponent } from '../../../shared/components/dialog/dialog-content/dialog-content.component';
import { DialogContainerComponent } from '../../../shared/components/dialog/dialog-container/dialog-container.component';

@Component({
  selector: 'app-spare-photo-dialog',
  imports: [DialogContainerComponent,
    DialogContentComponent,
    DialogHeaderComponent,
    DialogFooterComponent,
    Button,
    GalleriaModule,
    NgOptimizedImage,],
  templateUrl: './spare-photo-dialog.component.html',
  styleUrl: './spare-photo-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SparePhotoDialogComponent {
  @Output() onClose: EventEmitter<void> = new EventEmitter();
  @Input({ required: true }) visibility: boolean = false;
  @Input({ required: true, alias: 'selectedSpare' }) set _spare(value: SpareViewModel | null) {
    this.spare.set(value);
  }

  readonly spare: WritableSignal<SpareViewModel | null>;

  constructor() {
    this.spare = signal(null);
  }

  public mapPhotos(spare: SpareViewModel): string[] {
    return spare.photos.map((p) => {
      return p;
    });
  }

  public getHeader(spare: SpareViewModel): string {
    return spare.title;
  }

  public closeDialog($event: MouseEvent) {
    $event.stopPropagation();
    this.onClose.emit();
  }
}
