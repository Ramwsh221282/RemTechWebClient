import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  HostListener,
  input,
  InputSignal,
  Output,
  Signal,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { TransportCharacteristic } from '../../../types/transport-characteristic';
import { Button } from 'primeng/button';
import { Chip } from 'primeng/chip';
import { Select, SelectChangeEvent } from 'primeng/select';
import { CharacteristicFilterOption } from '../../../dto/advertisement-filter';
import { FormsModule } from '@angular/forms';

interface SelectionTransportCharacteristic {
  selectedValue: string;
  selectionValues: string[];
  selectionName: string;
}

@Component({
  selector: 'app-characteristics-filter-input',
  imports: [TableModule, Button, Chip, Select, FormsModule],
  templateUrl: './characteristics-filter-input.component.html',
  styleUrl: './characteristics-filter-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacteristicsFilterInputComponent {
  @Output() characteristicSelected: EventEmitter<CharacteristicFilterOption> =
    new EventEmitter<CharacteristicFilterOption>();
  @Output() characteristicsFlushed: EventEmitter<void> =
    new EventEmitter<void>();
  readonly characteristics: InputSignal<TransportCharacteristic[]> =
    input.required<TransportCharacteristic[]>();
  readonly selectionCharacteristics: Signal<
    SelectionTransportCharacteristic[]
  > = computed<SelectionTransportCharacteristic[]>(() => {
    return this.characteristics().map(
      (c: TransportCharacteristic): SelectionTransportCharacteristic => {
        return {
          selectedValue: '',
          selectionName: c.name,
          selectionValues: c.values,
        };
      },
    );
  });

  public chipLabel: string = 'Характеристики:';
  public chipWidth: string = 'auto';

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

  public handleCharacteristicSelected(
    $event: SelectChangeEvent,
    characteristic: SelectionTransportCharacteristic,
  ): void {
    const value = $event.value as string;
    const name: string = characteristic.selectionName;
    const option: CharacteristicFilterOption = { name: name, value: value };
    this.characteristicSelected.emit(option);
  }

  public handleCharacteristicsFlush($event: MouseEvent): void {
    $event.stopPropagation();
    this.selectionCharacteristics().forEach((c) => {
      c.selectedValue = '';
    });
    this.characteristicsFlushed.emit();
  }
}
