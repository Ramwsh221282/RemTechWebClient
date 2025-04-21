import { Component, HostListener, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ChipModule } from 'primeng/chip';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { AdvertisementFilterService } from '../../dto/advertisement-filter';
import { AddressFilterInputComponent } from './address-filter-input/address-filter-input.component';
import { PriceCriteriaFilterInputComponent } from './price-criteria-filter-input/price-criteria-filter-input.component';
import { SortCriteriaFilterInputComponent } from './sort-criteria-filter-input/sort-criteria-filter-input.component';
import { CharacteristicsFilterInputComponent } from './characteristics-filter-input/characteristics-filter-input.component';

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
    AddressFilterInputComponent,
    PriceCriteriaFilterInputComponent,
    SortCriteriaFilterInputComponent,
    CharacteristicsFilterInputComponent,
  ],
  templateUrl: './transport-items-filter-form.component.html',
  styleUrl: './transport-items-filter-form.component.scss',
})
export class TransportItemsFilterFormComponent {
  private readonly _dialogVisibility: WritableSignal<boolean> = signal(false);

  public chipLabel: string = 'Указать характеристику';
  public chipWidth: string = 'auto';

  public constructor() {}

  public get dialogVisibility(): boolean {
    return this._dialogVisibility();
  }

  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.updateChipLabel();
  }

  public turnDialogVisibility($event: MouseEvent): void {
    $event.stopPropagation();
    this._dialogVisibility.update((previous) => !previous);
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

  public submit($event: MouseEvent): void {}

  public clean($event: MouseEvent): void {
    const filter = AdvertisementFilterService.createEmpty();
  }
}
