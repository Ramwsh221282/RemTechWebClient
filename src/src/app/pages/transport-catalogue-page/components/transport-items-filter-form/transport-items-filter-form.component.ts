import { AdvertisementDto } from './../../dto/advertisement-dto';
import { PriceCriteria } from './../../../../shared/types/PriceCriteria';
import { Sorting } from './../../../../shared/types/Sorting';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberInputEvent, InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ChipModule } from 'primeng/chip';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { TransportItemsFilterCharacteristicsDialogComponent } from './transport-items-filter-characteristics-dialog/transport-items-filter-characteristics-dialog.component';
import {
  AdvertisementCharacteristic,
  CharacteristicResponse,
} from '../../types/advertisement';

@Component({
  selector: 'app-transport-items-filter-form',
  imports: [
    CardModule,
    FormsModule,
    PanelModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TableModule,
    ChipModule,
    PaginatorModule,
    DialogModule,
    TransportItemsFilterCharacteristicsDialogComponent,
  ],
  templateUrl: './transport-items-filter-form.component.html',
  styleUrl: './transport-items-filter-form.component.scss',
})
export class TransportItemsFilterFormComponent {
  private readonly _currentPage: WritableSignal<number> = signal(1);
  private readonly _dialogVisibility: WritableSignal<boolean> = signal(false);
  private readonly _subbmittedCharacteristics: WritableSignal<
    AdvertisementCharacteristic[]
  > = signal([]);
  private readonly _sortMode: WritableSignal<Sorting> = signal({
    mode: 'NONE',
  });
  private readonly _priceValue: WritableSignal<PriceCriteria> = signal({
    priceValueA: null,
    priceValueB: null,
  });
  private readonly _addressValue: WritableSignal<string> = signal('');

  @Output() pageUpdated: EventEmitter<number> = new EventEmitter();
  @Output() submittedFilters: EventEmitter<AdvertisementDto> =
    new EventEmitter();
  @Output() submittedPrice: EventEmitter<PriceCriteria> = new EventEmitter();
  @Output() onSortModeChange: EventEmitter<Sorting> = new EventEmitter();
  @Input({ required: true }) totalCount: number = 0;
  @Input({ required: true }) characteristics: CharacteristicResponse[] = [];
  public chipLabel: string = 'Указать характеристику';
  public sortLabel: string = 'Сортировка по цене';
  public chipWidth: string = 'auto';

  public get dialogVisibility(): boolean {
    return this._dialogVisibility();
  }

  public get userCharacteristics(): AdvertisementCharacteristic[] {
    return this._subbmittedCharacteristics();
  }

  public get address(): string {
    return this._addressValue();
  }

  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.updateChipLabel();
    this.updateSortLabel();
  }

  public acceptUserCharacteristics(
    characteristics: AdvertisementCharacteristic[]
  ) {
    this._subbmittedCharacteristics.set(characteristics);
  }

  public turnDialogVisibility($event: MouseEvent): void {
    $event.stopPropagation();
    this._dialogVisibility.update((previous) => !previous);
  }

  public updateSortLabel(): void {
    if (window.innerWidth < 900) {
      this.sortLabel = '';
      this.chipWidth = '40px';
      return;
    }
    (this.sortLabel = 'Сортировка по цене'), (this.chipWidth = 'auto');
    return;
  }

  public updateChipLabel() {
    if (window.innerWidth < 900) {
      this.chipLabel = '';
      this.chipWidth = '40px';
      return;
    }
    this.chipLabel = 'Указать характеристику';
    this.chipWidth = 'auto';
    return;
  }

  public emitPageChange(state: PaginatorState) {
    const pageNumber = state.page;
    if (!pageNumber) {
      if (this._currentPage() === 1) return;
      this._currentPage.set(1);
      this.pageUpdated.emit(1);
      return;
    } else {
      const adjusted = pageNumber + 1;
      if (adjusted === this._currentPage()) return;
      this._currentPage.set(adjusted);
      this.pageUpdated.emit(adjusted);
      return;
    }
  }

  public setSortMode(mode: string): void {
    const newSortMode: Sorting = { mode: mode! };
    this._sortMode.set(newSortMode);
    this.onSortModeChange.emit(newSortMode);
  }

  public isCurrentSortMode(mode: string): boolean {
    return this._sortMode().mode === mode;
  }

  public onPriceValueAChange(input: InputNumberInputEvent) {
    this._priceValue.update((prev) => {
      prev.priceValueA = Number(input.value);
      return prev;
    });
  }

  public onPriceValueBChange(input: InputNumberInputEvent) {
    this._priceValue.update((prev) => {
      prev.priceValueB = Number(input.value);
      return prev;
    });
  }

  public onAddressValueChange($event: Event) {
    this._addressValue.update((prev) => {
      const input = $event.target as HTMLInputElement;
      prev = input.value;
      return prev;
    });
  }

  public submit($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    const characteristics = this._subbmittedCharacteristics();
    const address = this._addressValue();
    const price = this._priceValue();
    const advertisement: AdvertisementDto = {
      address: address.trim().length > 0 ? address : null,
      characteristics: characteristics,
    };
    this.submittedFilters.emit(advertisement);
    this.submittedPrice.emit(price);
  }
}
