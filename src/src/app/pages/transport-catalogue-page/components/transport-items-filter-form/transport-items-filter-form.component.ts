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
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ChipModule } from 'primeng/chip';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

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
  private readonly _currentPage: WritableSignal<number> = signal(1);
  @Output() pageUpdated: EventEmitter<number> = new EventEmitter();
  @Input({ required: true }) totalCount: number = 0;
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
}

export type DummyCtx = {
  name: string;
  value: string;
};
