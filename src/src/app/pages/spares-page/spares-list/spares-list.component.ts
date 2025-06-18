import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PanelModule } from 'primeng/panel';
import { SpareViewModel } from '../types/spare-viewmodel';
import { AnimationsFactory } from '../../../shared/animations/animations-factory';
import { SpareItemComponent } from "./spare-item/spare-item.component";
import { SearchBarComponent } from "../../../shared/components/search-bar/search-bar.component";
import { SpareTextSearchPayload } from '../types/spare-text-search-payload';
import { StringUtils } from '../../../shared/utils/string-utils';
import { SpareSortPayload } from '../types/spare-sort-payload';
import { SortCriteriaFilterInputComponent } from "../../transport-catalogue-page/components/transport-items-filter-form/sort-criteria-filter-input/sort-criteria-filter-input.component";
import { Sorting, SortingFactory } from '../../../shared/types/Sorting';

@Component({
  selector: 'app-spares-list',
  imports: [
    PanelModule,
    ButtonModule,
    DataViewModule,
    NgClass,
    ScrollPanelModule,
    ProgressSpinnerModule,
    SpareItemComponent,
    SearchBarComponent,
    SortCriteriaFilterInputComponent
  ],
  templateUrl: './spares-list.component.html',
  styleUrl: './spares-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [AnimationsFactory.fadeInAnimation('0.5s ease-in')],
})
export class SparesListComponent {
  @Output() spareSelected: EventEmitter<SpareViewModel>;
  @Output() textSearchEvent: EventEmitter<SpareTextSearchPayload | null>;
  @Output() sortEvent: EventEmitter<SpareSortPayload | null>;

  @Input({ required: true, alias: 'spares' }) set _spares(value: SpareViewModel[]) {
    this.sparesSignal.set(value);
  }

  @Input({ required: true, alias: 'isLoading' }) set _isLoading(value: boolean) {
    this.isLoadingSignal.set(value);
  }

  @Input({ required: true, alias: 'sorting' }) set _sorting(value: Sorting) {
    this.sortingSignal.set(value);
  }

  readonly sparesSignal: WritableSignal<SpareViewModel[]>;
  readonly isLoadingSignal: WritableSignal<boolean>
  readonly sortingSignal: WritableSignal<Sorting>;

  constructor() {
    this.sortingSignal = signal(SortingFactory.default())
    this.sortEvent = new EventEmitter();
    this.textSearchEvent = new EventEmitter();
    this.spareSelected = new EventEmitter();
    this.sparesSignal = signal([]);
    this.isLoadingSignal = signal(false);
  }

  public handleTextSearchSubmit($event: string): void {
    if (StringUtils.isEmptyOrWhiteSpace($event)) {
      this.textSearchEvent.emit(null);
    }
    const payload: SpareTextSearchPayload = { textSearch: $event };
    this.textSearchEvent.emit(payload);
  }

  public handleSortChangeEvent($event: Sorting): void {
    const mode = $event.mode;
    if (mode === 'NONE') {
      this.sortEvent.emit(null);
      return;
    }
    if (mode === 'ASC') {
      const payload: SpareSortPayload = { sortMode: 'ASC' }
      this.sortEvent.emit(payload);
      return;
    }
    if (mode === 'DESC') {
      const payload: SpareSortPayload = { sortMode: 'DESC' }
      this.sortEvent.emit(payload);
      return;
    }
  }

  public handleSpareSelect($event: SpareViewModel): void {
    this.spareSelected.emit($event);
  }
}
