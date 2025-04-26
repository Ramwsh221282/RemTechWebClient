import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  Output,
} from '@angular/core';
import { Parser } from '../../types/parser';
import { Select, SelectChangeEvent } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { Panel } from 'primeng/panel';

@Component({
  selector: 'app-parsers-select',
  imports: [Select, FormsModule, Panel],
  templateUrl: './parsers-select.component.html',
  styleUrl: './parsers-select.component.scss',
})
export class ParsersSelectComponent {
  @Output() parserSelected: EventEmitter<Parser> = new EventEmitter();
  readonly parsers: InputSignal<Parser[]> = input.required<Parser[]>();

  public handleParserSelect($event: SelectChangeEvent): void {
    const parser = $event.value as Parser;
    this.parserSelected.emit(parser);
  }
}
