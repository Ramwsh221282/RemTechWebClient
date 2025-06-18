import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Chip } from 'primeng/chip';
import { FormsModule } from '@angular/forms';
import { SpareOemPayload } from '../../types/spare-oem-payload';
import { StringUtils } from '../../../../shared/utils/string-utils';

@Component({
  selector: 'app-spares-oem-filter-input',
  imports: [Button, InputText, Chip, FormsModule],
  templateUrl: './spares-oem-filter-input.component.html',
  styleUrl: './spares-oem-filter-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SparesOemFilterInputComponent {
  @Output() spareOemFilterEvent: EventEmitter<SpareOemPayload | null>;
  public chipLabel: string = 'Номер:';
  public chipWidth: string = 'auto';
  public oemInput: string | null;

  constructor() {
    this.spareOemFilterEvent = new EventEmitter();
    this.oemInput = null;
  }

  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.updateChipLabel();
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

  public acceptOemFilter($event: MouseEvent): void {
    $event.stopPropagation();
    if (!this.oemInput) {
      this.spareOemFilterEvent.emit(null);
      return;
    }
    if (StringUtils.isEmptyOrWhiteSpace(this.oemInput)) {
      this.spareOemFilterEvent.emit(null);
      return;
    }
    const oemFilterPayload: SpareOemPayload = { oem: this.oemInput };
    this.spareOemFilterEvent.emit(oemFilterPayload);
  }

  public flushOemFilter($event: MouseEvent): void {
    $event.stopPropagation();
    this.oemInput = null;
    this.spareOemFilterEvent.emit(null);
  }
}
