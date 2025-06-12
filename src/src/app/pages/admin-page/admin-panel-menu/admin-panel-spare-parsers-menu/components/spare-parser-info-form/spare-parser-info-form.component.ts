import {
  Component,
  computed,
  Input,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { Panel } from 'primeng/panel';
import { SpareParser } from '../../models/spare-parser-ts';
import { DatePipe } from '@angular/common';
import { Select, SelectChangeEvent } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-spare-parser-info-form',
  imports: [Panel, DatePipe, Select, FormsModule, Button],
  templateUrl: './spare-parser-info-form.component.html',
  styleUrl: './spare-parser-info-form.component.scss',
})
export class SpareParserInfoFormComponent {
  @Input({ required: true, alias: 'selectedParser' }) set _parser(
    value: SpareParser,
  ) {
    this.spareParserSignal.set(value);
    this._valueCopy.set(value);
  }

  private readonly _waitDays: number[] = [1, 2, 3, 4, 5, 6, 7];
  private readonly _valueCopy: WritableSignal<SpareParser | null>;
  readonly spareParserSignal: WritableSignal<SpareParser | null>;
  readonly isEditingSignal: WritableSignal<boolean>;
  readonly waitDaysComputedSignal: Signal<number[]>;
  readonly statesComputedSignal: Signal<string[]>;

  constructor() {
    this.spareParserSignal = signal(null);
    this._valueCopy = signal(null);
    this.isEditingSignal = signal(false);
    this.waitDaysComputedSignal = computed(() => {
      return this._waitDays;
    });
    this.statesComputedSignal = computed((): string[] => {
      const parser: SpareParser | null = this.spareParserSignal();
      if (!parser) return ['Неопределено'];
      const currentState: string = parser.state;
      if (
        currentState === 'Парсит' ||
        currentState === 'Включен' ||
        currentState === 'Простаивает'
      ) {
        return ['Отключен'];
      } else return ['Включен'];
    });
  }

  public handleWaitDaysChange($event: SelectChangeEvent): void {
    const day: number = $event.value as number;
    const parser: SpareParser | null = this.spareParserSignal();
    if (!parser) return;
    const updated = { ...parser, waitDays: day };
    this.spareParserSignal.set(updated);
  }

  public handleStateChange($event: SelectChangeEvent): void {
    const state: string = $event.value as string;
    const parser: SpareParser | null = this.spareParserSignal();
    if (!parser) return;
    const updated = { ...parser, state: state };
    this.spareParserSignal.set(updated);
  }

  public startEditing($event: MouseEvent): void {
    $event.stopPropagation();
    this.isEditingSignal.set(true);
  }

  public saveChanges($event: MouseEvent): void {
    $event.stopPropagation();
    this.isEditingSignal.set(false);
  }
}
