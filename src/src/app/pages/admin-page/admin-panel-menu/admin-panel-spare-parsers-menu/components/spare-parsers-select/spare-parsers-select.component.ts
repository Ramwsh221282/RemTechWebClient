import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { Panel } from 'primeng/panel';
import { Select, SelectChangeEvent } from 'primeng/select';
import { SpareParser } from '../../models/spare-parser-ts';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-spare-parsers-select',
  imports: [Panel, Select, FormsModule],
  templateUrl: './spare-parsers-select.component.html',
  styleUrl: './spare-parsers-select.component.scss',
})
export class SpareParsersSelectComponent {
  @Output() parserSelected: EventEmitter<SpareParser>;

  @Input({ required: true, alias: 'parsers' }) set _parsers(
    value: SpareParser[],
  ) {
    this.parsersSignal.set(value);
  }

  readonly parsersSignal: WritableSignal<SpareParser[]>;

  constructor() {
    this.parsersSignal = signal([]);
    this.parserSelected = new EventEmitter<SpareParser>();
  }

  public handleSelect($event: SelectChangeEvent): void {
    const parser = $event.value as SpareParser;
    this.parserSelected.emit(parser);
  }
}
