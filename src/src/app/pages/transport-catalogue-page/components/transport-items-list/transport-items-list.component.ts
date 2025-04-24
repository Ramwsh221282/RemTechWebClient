import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { Advertisement } from '../../types/advertisement';
import { PanelModule } from 'primeng/panel';
import { TransportItemComponent } from '../transport-item/transport-item.component';
import { DataViewModule } from 'primeng/dataview';
import { NgClass } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AnimationsFactory } from '../../../../shared/animations/animations-factory';
import { SearchBarComponent } from '../../../../shared/components/search-bar/search-bar.component';
import { SortCriteriaFilterInputComponent } from '../transport-items-filter-form/sort-criteria-filter-input/sort-criteria-filter-input.component';
import { Sorting, SortingFactory } from '../../../../shared/types/Sorting';

@Component({
  selector: 'app-transport-items-list',
  imports: [
    PanelModule,
    TransportItemComponent,
    ButtonModule,
    DataViewModule,
    NgClass,
    ScrollPanelModule,
    ProgressSpinnerModule,
    SearchBarComponent,
    SortCriteriaFilterInputComponent,
  ],
  templateUrl: './transport-items-list.component.html',
  styleUrl: './transport-items-list.component.scss',
  animations: [AnimationsFactory.fadeInAnimation('0.5s ease-in')],
})
export class TransportItemsListComponent {
  @Input({ required: true }) items: Advertisement[];
  @Input({ required: true }) isLoading: boolean;
  @Output() sortChange: EventEmitter<Sorting>;
  @Output() textSearchSumit: EventEmitter<string>;
  @Output() advertisementPhotoInvoked: EventEmitter<Advertisement>;
  sortSignal: WritableSignal<Sorting>;

  constructor() {
    this.items = [];
    this.isLoading = false;
    this.sortSignal = signal(SortingFactory.default());
    this.sortChange = new EventEmitter<Sorting>();
    this.textSearchSumit = new EventEmitter<string>();
    this.advertisementPhotoInvoked = new EventEmitter<Advertisement>();
  }

  public handleSortChanged(sort: Sorting): void {
    this.sortSignal.set(sort);
    this.sortChange.emit(this.sortSignal());
  }

  public handleTextSearchTermSubmit(searchTerm: string): void {
    this.textSearchSumit.emit(searchTerm);
  }

  public handleAdvertisementPhotoInvoked(advertisement: Advertisement): void {
    this.advertisementPhotoInvoked.emit(advertisement);
  }
}
