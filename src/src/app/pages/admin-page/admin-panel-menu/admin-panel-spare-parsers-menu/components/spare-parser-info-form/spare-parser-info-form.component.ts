import {
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
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
import {
  SpareParserUpdateDetails,
  SpareParserUpdateScheduleDetails,
  SpareParserUpdateStateDetails,
} from '../../models/spare-parser-update-details';

@Component({
  selector: 'app-spare-parser-info-form',
  imports: [Panel, DatePipe, Select, FormsModule, Button],
  templateUrl: './spare-parser-info-form.component.html',
  styleUrl: './spare-parser-info-form.component.scss',
})
export class SpareParserInfoFormComponent {
  @Output() onSaveChange: EventEmitter<SpareParserUpdateDetails>;
  @Output() onInstantlyActivate: EventEmitter<SpareParser>;

  @Input({ required: true, alias: 'selectedParser' }) set _parser(
    value: SpareParser,
  ) {
    this.spareParserSignal.set(value);
    this._spareParserUpdateDetails.set({ name: value.name });
  }

  private readonly _waitDays: number[] = [1, 2, 3, 4, 5, 6, 7];
  private readonly _spareParserUpdateDetails: WritableSignal<SpareParserUpdateDetails | null>;

  readonly spareParserSignal: WritableSignal<SpareParser | null>;
  readonly isEditingSignal: WritableSignal<boolean>;
  readonly waitDaysComputedSignal: Signal<number[]>;
  readonly statesComputedSignal: Signal<string[]>;

  constructor() {
    this.onInstantlyActivate = new EventEmitter<SpareParser>();
    this._spareParserUpdateDetails = signal(null);
    this.onSaveChange = new EventEmitter<SpareParserUpdateDetails>();
    this.spareParserSignal = signal(null);
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
    let updateDetails: SpareParserUpdateDetails | null =
      this._spareParserUpdateDetails();
    if (!updateDetails) updateDetails = { name: parser.name };

    const nextRunDate: Date = new Date(parser.lastRun);
    nextRunDate.setDate(nextRunDate.getDate() + day);

    const updated: SpareParser = {
      ...parser,
      waitDays: day,
      nextRun: nextRunDate,
    };
    const waitDaysUpdated: SpareParserUpdateScheduleDetails = {
      waitDays: updated.waitDays,
      nextRun: updated.nextRun,
      lastRun: updated.lastRun,
    };
    updateDetails = { ...updateDetails, scheduleUpdate: waitDaysUpdated };
    this._spareParserUpdateDetails.set(updateDetails);
    this.spareParserSignal.set(updated);
  }

  public handleStateChange($event: SelectChangeEvent): void {
    const state: string = $event.value as string;
    const parser: SpareParser | null = this.spareParserSignal();
    if (!parser) return;
    let updateDetails = this._spareParserUpdateDetails();
    if (!updateDetails) updateDetails = { name: parser.name };

    const updated = { ...parser, state: state };
    const stateUpdate: SpareParserUpdateStateDetails = { state: updated.state };
    updateDetails = { ...updateDetails, stateUpdate: stateUpdate };
    this._spareParserUpdateDetails.set(updateDetails);
    this.spareParserSignal.set(updated);
  }

  public startEditing($event: MouseEvent): void {
    $event.stopPropagation();
    this.isEditingSignal.set(true);
  }

  public saveChanges($event: MouseEvent): void {
    $event.stopPropagation();
    const updated: SpareParser | null = this.spareParserSignal();
    if (!updated) return;
    const updateDetails: SpareParserUpdateDetails | null =
      this._spareParserUpdateDetails();
    if (!updateDetails) return;
    this.onSaveChange.emit(updateDetails);
    const updateDetailsRefresh: SpareParserUpdateDetails = {
      ...updateDetails,
      scheduleUpdate: null,
      stateUpdate: null,
    };
    this._spareParserUpdateDetails.set(updateDetailsRefresh);
    this.isEditingSignal.set(false);
  }

  private isCopyEqualToChanged(
    copy: SpareParser,
    updated: SpareParser,
  ): boolean {
    console.log(copy);
    console.log(updated);
    return copy.waitDays === updated.waitDays && copy.state === updated.state;
  }

  private formUpdateDetails(
    copy: SpareParser,
    updated: SpareParser,
  ): SpareParserUpdateDetails {
    let details: SpareParserUpdateDetails = { name: updated.name };
    if (copy.state !== updated.state)
      details = { ...details, stateUpdate: { state: updated.state } };
    if (copy.waitDays !== updated.waitDays)
      details = {
        ...details,
        scheduleUpdate: {
          lastRun: updated.lastRun,
          nextRun: updated.nextRun,
          waitDays: updated.waitDays,
        },
      };
    return details;
  }

  public instantlyStart($event: MouseEvent): void {
    $event.stopPropagation();
    const parser: SpareParser | null = this.spareParserSignal();
    if (!parser) return;
    const updated: SpareParser = {
      ...parser,
      nextRun: parser.lastRun,
      lastRun: parser.lastRun,
    };
    this.spareParserSignal.set(updated);
    this.onInstantlyActivate.emit(parser);
    this.isEditingSignal.set(false);
  }
}
