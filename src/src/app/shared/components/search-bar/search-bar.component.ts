import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-search-bar',
  imports: [
    ToolbarModule,
    ButtonModule,
    FormsModule,
    PanelModule,
    InputTextModule,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  @Input() placeHolderText = 'Поиск в тексте';
  @Output() subbmitedSearchTerm: EventEmitter<string> = new EventEmitter();
  public input: WritableSignal<string> = signal('');

  public onSubmit(event: MouseEvent | KeyboardEvent): void {
    event.stopPropagation();
    if (this.isInputEmpty()) return;
    if (event instanceof MouseEvent) this.submitSearch();
    if (event instanceof KeyboardEvent && event.key === 'Enter')
      this.submitSearch();
  }

  public onInputChange(input: string) {
    this.input.set(input);
  }

  private isInputEmpty(): boolean {
    return this.input().trim().length === 0;
  }

  private submitSearch(): void {
    const searchTerm = this.trimString(this.input());
    this.subbmitedSearchTerm.emit(searchTerm);
    this.input.set('');
  }

  private trimString(input: string): string {
    const trimmed = input.trim();
    return trimmed;
  }
}
