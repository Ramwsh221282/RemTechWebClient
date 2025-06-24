import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  SpareViewModel,
  SpareViewModelFactory,
} from '../../types/spare-viewmodel';
import { Chip } from 'primeng/chip';
import { NgOptimizedImage } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AnimationsFactory } from '../../../../shared/animations/animations-factory';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-spare-item',
  imports: [CardModule, ButtonModule, NgOptimizedImage, Chip, DecimalPipe],
  templateUrl: './spare-item.component.html',
  styleUrl: './spare-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    AnimationsFactory.fadeInAnimation('0.5s ease-in'),
    AnimationsFactory.fadeOutAnimation('0.5s ease-in'),
  ],
})
export class SpareItemComponent {
  @Output() spareSelected: EventEmitter<SpareViewModel>;
  @Input({ required: true }) spare: SpareViewModel;

  constructor() {
    this.spare = SpareViewModelFactory.empty();
    this.spareSelected = new EventEmitter();
  }

  public showPhotoGallery($event: MouseEvent): void {
    $event.stopPropagation();
    this.spareSelected.emit(this.spare);
  }

  public hasPhoto(): boolean {
    return this.spare.photos.length > 0;
  }
}
