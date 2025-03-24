import { Component, Input } from '@angular/core';
import { Advertisement } from '../../types/advertisement';
import { PanelModule } from 'primeng/panel';
import { TransportItemComponent } from '../transport-item/transport-item.component';
import { DataViewModule } from 'primeng/dataview';
import { NgClass, NgFor } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

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
})
export class TransportItemsListComponent {
  @Input({ required: true }) items: Advertisement[] = [];
  @Input({ required: true }) isLoading: boolean = true;
}
