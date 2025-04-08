import {Component} from '@angular/core';
import {Parser} from '../../types/parser';
import {ListboxChangeEvent, ListboxModule} from 'primeng/listbox';
import {FormsModule} from '@angular/forms';
import {ParserPanelViewModel} from '../services/parsers-panel-viewmodel.service';
import {ArrayUtils} from '../../../../shared/utils/array-utils';

@Component({
  selector: 'app-parsers-list',
  imports: [ListboxModule, FormsModule],
  templateUrl: './parsers-list.component.html',
  styleUrl: './parsers-list.component.scss'
})
export class ParsersListComponent {
  public readonly viewModel: ParserPanelViewModel;
  public constructor(viewModel: ParserPanelViewModel) {
    this.viewModel = viewModel;
  }

  public handleSelectedParser(event: ListboxChangeEvent) {
    const parserSelected = event.value as Parser;
    const parsers: Parser[] = this.viewModel.parsers;
    const parser: Parser | null = ArrayUtils.getItem(parsers, item => item.id === parserSelected.id);
    if (parser) this.viewModel.selectedParser = parser;
  }
}
