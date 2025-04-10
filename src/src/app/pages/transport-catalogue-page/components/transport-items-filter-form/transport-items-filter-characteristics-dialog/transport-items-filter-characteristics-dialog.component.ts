import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogContainerComponent } from '../../../../../shared/components/dialog/dialog-container/dialog-container.component';
import { DialogContentComponent } from '../../../../../shared/components/dialog/dialog-content/dialog-content.component';
import { DialogHeaderComponent } from '../../../../../shared/components/dialog/dialog-header/dialog-header.component';
import { DialogInputComponent } from '../../../../../shared/components/dialog/dialog-input/dialog-input.component';
import { DialogFooterComponent } from '../../../../../shared/components/dialog/dialog-footer/dialog-footer.component';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TransportCataloguePageService } from '../../../services/transport-catalogue-page-service';
import { AdvertisementCharacteristic } from '../../../types/advertisement';
import { ArrayUtils } from '../../../../../shared/utils/array-utils';
import {
  AdvertisementFilterService,
  CharacteristicFilterOption,
} from '../../../dto/advertisement-filter';

@Component({
  selector: 'app-transport-items-filter-characteristics-dialog',
  imports: [
    ButtonModule,
    DialogContainerComponent,
    DialogContentComponent,
    DialogHeaderComponent,
    DialogInputComponent,
    DialogFooterComponent,
    SelectModule,
    FormsModule,
  ],
  templateUrl: './transport-items-filter-characteristics-dialog.component.html',
  styleUrl: './transport-items-filter-characteristics-dialog.component.scss',
})
export class TransportItemsFilterCharacteristicsDialogComponent {
  @Input({ required: true }) visibility: boolean = false;
  @Output() onClose: EventEmitter<MouseEvent> = new EventEmitter();
  private readonly _pageService: TransportCataloguePageService;
  public internalCharacteristics: AdvertisementCharacteristic[] = [];

  public constructor(pageService: TransportCataloguePageService) {
    this._pageService = pageService;
  }

  public get characteristics(): AdvertisementCharacteristic[] {
    return this._pageService.characteristics.map((val) => {
      const ctx: AdvertisementCharacteristic = { name: val.name, value: '' };
      return ctx;
    });
  }

  public removeCharacteristic(
    characteristic: AdvertisementCharacteristic
  ): void {
    const withoutCharacteristic = ArrayUtils.removeItem(
      this.internalCharacteristics,
      (c) => c.name === characteristic.name
    );
    this.internalCharacteristics = [...withoutCharacteristic];
  }

  public select(event: SelectChangeEvent): void {
    const characteristic = this.resolveSelectCharacteristic(event);
    if (this.alreadyContainsCharacteristic(characteristic)) return;
    this.internalCharacteristics = [
      characteristic,
      ...this.internalCharacteristics,
    ];
    console.log(this.internalCharacteristics);
  }

  public clear(event: MouseEvent): void {
    event.stopPropagation();
    this.cleanInternalFilters();
  }

  public submit(event: MouseEvent): void {
    event.stopPropagation();
    const filter = this._pageService.filter;
    const options = this.internalCharacteristics.map((c) => {
      const option: CharacteristicFilterOption = {
        name: c.name,
        value: c.value,
      };
      return option;
    });
    const updated = AdvertisementFilterService.appplyCharacteristics(
      filter,
      options
    );
    this._pageService.updateFilter(updated);
    this.cleanInternalFilters();
    this.close(event);
  }

  public close(event: MouseEvent): void {
    this.cleanInternalFilters();
    this.onClose.emit(event);
  }

  private resolveSelectCharacteristic(
    event: SelectChangeEvent
  ): AdvertisementCharacteristic {
    return event.value as AdvertisementCharacteristic;
  }

  private alreadyContainsCharacteristic(
    characteristic: AdvertisementCharacteristic
  ): boolean {
    return (
      ArrayUtils.getItem(
        this.internalCharacteristics,
        (c) => c.name === characteristic.name
      ) !== null
    );
  }

  private cleanInternalFilters() {
    this.internalCharacteristics = [];
  }
}
