import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Advertisement } from '../../types/advertisement';
import { PanelModule } from 'primeng/panel';
import { TransportItemComponent } from '../transport-item/transport-item.component';
import { DataViewModule } from 'primeng/dataview';
import { NgClass, NgFor } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {AnimationsFactory} from '../../../../shared/animations/animations-factory';

@Component({
  selector: 'app-transport-items-list',
  imports: [
    PanelModule,
    TransportItemComponent,
    ButtonModule,
    DataViewModule,
    NgFor,
    NgClass,
    ScrollPanelModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './transport-items-list.component.html',
  styleUrl: './transport-items-list.component.scss',
  animations: [AnimationsFactory.fadeInAnimation('0.5s ease-in')]
})
export class TransportItemsListComponent {
  @Input({ required: true }) items: Advertisement[] = [];
  @Input({ required: true }) isLoading: boolean = true;
  @Output() showPhotoGallery: EventEmitter<Advertisement> = new EventEmitter();
}
