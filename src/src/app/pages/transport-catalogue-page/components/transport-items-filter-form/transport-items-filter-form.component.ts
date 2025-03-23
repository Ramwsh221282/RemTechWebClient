import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ChipModule } from 'primeng/chip';
import { PaginatorModule } from 'primeng/paginator';

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
  ],
  templateUrl: './transport-items-filter-form.component.html',
  styleUrl: './transport-items-filter-form.component.scss',
})
export class TransportItemsFilterFormComponent {
  public chipLabel: string = 'Указать характеристику';
  public buttonLabel: string = 'Применить фильтры';
  public chipWidth: string = 'auto';

  public dummyCtxArray: DummyCtx[] = [{ name: 'Модель', value: 'PONSSE' }];

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateChipLabel();
    this.updateButtonLabel();
  }

  public updateButtonLabel(): void {
    if (window.innerWidth < 600) {
      this.buttonLabel = '';
      return;
    } else {
      this.buttonLabel = 'Применить фильтры';
      return;
    }
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
}

export type DummyCtx = {
  name: string;
  value: string;
};
