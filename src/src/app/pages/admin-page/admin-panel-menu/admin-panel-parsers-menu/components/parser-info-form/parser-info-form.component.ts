import {
  Component,
  computed,
  EventEmitter,
  Output,
  Signal,
  signal,
  Input,
  WritableSignal,
} from '@angular/core';
import { Parser, ParserFactory, ParserUpdateData } from '../../types/parser';
import { Panel } from 'primeng/panel';
import { Button } from 'primeng/button';
import { Select, SelectChangeEvent } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ParsersHttpService } from '../../services/parsers-http.service';

@Component({
  selector: 'app-parser-info-form',
  imports: [Panel, Button, Select, FormsModule, DatePipe],
  templateUrl: './parser-info-form.component.html',
  styleUrl: './parser-info-form.component.scss',
})
export class ParserInfoFormComponent {
  @Output() onEditingChange: EventEmitter<boolean> = new EventEmitter();
  @Output() parserUpdated: EventEmitter<Parser> = new EventEmitter();

  @Input({ alias: 'selectedParser', required: true })
  set _selectedParser(parser: Parser) {
    this.selectedParserSignal.set(parser);
  }

  @Input({ alias: 'isEditingParser', required: true })
  set _isEditingParser(isEditingParser: boolean) {
    this.isEditingParserSignal.set(isEditingParser);
  }

  private readonly _waitDays: number[] = [1, 2, 3, 4, 5, 6, 7];
  private readonly _httpService: ParsersHttpService;
  readonly selectedParserSignal: WritableSignal<Parser> = signal(
    ParserFactory.empty(),
  );
  readonly isEditingParserSignal: WritableSignal<boolean> = signal(false);
  readonly waitDaysComputedSignal: Signal<number[]> = computed((): number[] => {
    const currentWaitDay: number = this.selectedParserSignal().waitDays;
    return this._waitDays.filter(
      (waitDay: number): boolean => waitDay !== currentWaitDay,
    );
  });
  readonly statesComputedSignal: Signal<string[]> = computed((): string[] => {
    const currentState: string = this.selectedParserSignal().state;
    if (
      currentState === 'Парсит' ||
      currentState === 'Включен' ||
      currentState === 'Простаивает'
    ) {
      return ['Отключен'];
    } else return ['Включен'];
  });

  constructor(httpService: ParsersHttpService) {
    this._httpService = httpService;
  }

  public saveChanges($event: MouseEvent): void {
    $event.stopPropagation();
    this.onEditingChange.emit(false);
  }

  public startEditing($event: MouseEvent): void {
    $event.stopPropagation();
    this.onEditingChange.emit(true);
  }

  public handleWaitDaysChange($event: SelectChangeEvent): void {
    const waitDays: number = $event.value as number;
    const parser: Parser = this.selectedParserSignal();
    const id: string = parser.id;
    const updateData: ParserUpdateData = { id: id, waitDays: waitDays };
    this._httpService.updateParser(parser, updateData).subscribe((result) => {
      if (result.code === 200) {
        this._httpService.getParserById(result.data).subscribe((fetch) => {
          if (fetch.code === 200) this.parserUpdated.emit(fetch.data);
        });
      }
    });
  }

  public handleStateChange($event: SelectChangeEvent): void {
    const state: string = $event.value as string;
    const parser: Parser = this.selectedParserSignal();
    const id: string = parser.id;
    const updateData: ParserUpdateData = { id: id, state: state };
    this._httpService.updateParser(parser, updateData).subscribe((result) => {
      if (result.code === 200) {
        this._httpService.getParserById(result.data).subscribe((fetch) => {
          if (fetch.code === 200) this.parserUpdated.emit(fetch.data);
        });
      }
    });
  }

  public instantlyStart($event: MouseEvent): void {
    $event.stopPropagation();
    const parser: Parser = this.selectedParserSignal();
    const id: string = parser.id;
    this._httpService.instantlyStart(id).subscribe((result) => {
      if (result.code === 200) {
        this._httpService.getParserById(result.data).subscribe((fetch) => {
          if (fetch.code === 200) this.parserUpdated.emit(fetch.data);
        });
      }
    });
  }
}
