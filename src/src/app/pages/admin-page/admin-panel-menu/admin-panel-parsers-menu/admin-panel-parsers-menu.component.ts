import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ParsersHttpService } from './services/parsers-http.service';
import { Parser } from './types/parser';
import { finalize } from 'rxjs';
import { ParsersSelectComponent } from './components/parsers-select/parsers-select.component';
import { ParserInfoFormComponent } from './components/parser-info-form/parser-info-form.component';
import { NgIf } from '@angular/common';
import { ParserLinksFormComponent } from './components/parser-links-form/parser-links-form.component';
import { ParserProfile } from './types/parser-profile';
import { ParserChartsComponent } from './components/parser-charts/parser-charts.component';

@Component({
  selector: 'app-admin-panel-parsers-menu',
  imports: [
    ParsersSelectComponent,
    ParserInfoFormComponent,
    NgIf,
    ParserLinksFormComponent,
    ParserChartsComponent,
  ],
  templateUrl: './admin-panel-parsers-menu.component.html',
  styleUrl: './admin-panel-parsers-menu.component.scss',
})
export class AdminPanelParsersMenuComponent implements OnInit {
  private readonly _httpService: ParsersHttpService;
  readonly parsersSignal: WritableSignal<Parser[]>;
  readonly isLoadingSignal: WritableSignal<boolean>;
  readonly selectedParserSignal: WritableSignal<Parser | null>;
  readonly isEditingParser: WritableSignal<boolean>;
  readonly isEditingLinks: WritableSignal<boolean>;

  constructor(httpService: ParsersHttpService) {
    this._httpService = httpService;
    this.isLoadingSignal = signal(false);
    this.parsersSignal = signal([]);
    this.selectedParserSignal = signal(null);
    this.isEditingParser = signal(false);
    this.isEditingLinks = signal(false);
  }

  public ngOnInit(): void {
    this.isLoadingSignal.set(true);
    this._httpService
      .getAllParsers()
      .pipe(finalize(() => this.isLoadingSignal.set(false)))
      .subscribe((result) => {
        if (result.code === 200) {
          this.parsersSignal.set(result.data);
          this.selectedParserSignal.set(result.data[0]);
        }
      });
  }

  public handleParserSelected(parser: Parser): void {
    this.selectedParserSignal.set(parser);
    this.isEditingParser.set(false);
    this.isEditingLinks.set(false);
  }

  public handleIsEditingLinksChange($event: boolean): void {
    this.isEditingLinks.set($event);
  }

  public handleEditingLinksSaveChanges($event: boolean): void {
    this.isEditingLinks.set($event);
  }

  public handleEditingChange($event: boolean): void {
    this.isEditingParser.set($event);
  }

  public handleParserUpdated($event: Parser): void {
    const currentParser: Parser | null = this.selectedParserSignal();
    if (!currentParser) return;
    this.selectedParserSignal.set($event);
    this.updateParsersArray($event);
  }

  public handleLinkRemoved(link: ParserProfile): void {
    const currentParser: Parser | null = this.selectedParserSignal();
    if (!currentParser) return;
    if (currentParser.id !== link.parserId) return;
    const updatedLinks: ParserProfile[] = currentParser.profiles.filter(
      (profile: ParserProfile) => profile.link !== link.link,
    );
    const updatedParser: Parser = { ...currentParser, profiles: updatedLinks };
    this.selectedParserSignal.set(updatedParser);
    this.updateParsersArray(updatedParser);
  }

  public handleLinkAdded(link: ParserProfile): void {
    const currentParser: Parser | null = this.selectedParserSignal();
    if (!currentParser) return;
    if (currentParser.id !== link.parserId) return;
    const updatedLinks: ParserProfile[] = [link, ...currentParser.profiles];
    const updatedParser: Parser = { ...currentParser, profiles: updatedLinks };
    this.selectedParserSignal.set(updatedParser);
    this.updateParsersArray(updatedParser);
  }

  private updateParsersArray(updatedParser: Parser): void {
    const parsers = this.parsersSignal();
    const index = parsers.findIndex((p) => p.id === updatedParser.id);
    if (index < 0) return;
    parsers[index] = updatedParser;
    this.parsersSignal.set(parsers);
  }
}
