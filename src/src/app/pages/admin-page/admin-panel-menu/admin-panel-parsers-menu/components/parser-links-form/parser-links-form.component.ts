import {
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { Parser, ParserFactory } from '../../types/parser';
import { Panel } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { ParserProfile } from '../../types/parser-profile';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ParsersHttpService } from '../../services/parsers-http.service';
import { ScrollPanel } from 'primeng/scrollpanel';

interface NewLinkInputProperties {
  name: string;
  link: string;
}

@Component({
  selector: 'app-parser-links-form',
  imports: [Panel, TableModule, Button, InputText, FormsModule, ScrollPanel],
  templateUrl: './parser-links-form.component.html',
  styleUrl: './parser-links-form.component.scss',
})
export class ParserLinksFormComponent {
  @Output() linkRemoved: EventEmitter<ParserProfile>;
  @Output() linkAdded: EventEmitter<ParserProfile>;
  @Output() startEditingLinks: EventEmitter<boolean>;
  @Output() saveEditingLinks: EventEmitter<boolean>;

  @Input({ alias: 'selectedParser', required: true }) set _selectedParser(
    value: Parser,
  ) {
    this.selectedParserSignal.set(value);
  }

  @Input({ alias: 'isEditingProfiles', required: true }) set _isEditingProfiles(
    value: boolean,
  ) {
    this.isEditingProfilesSignal.set(value);
  }

  private readonly _httpService;
  readonly selectedParserSignal: WritableSignal<Parser>;
  readonly isEditingProfilesSignal: WritableSignal<boolean>;
  readonly profilesComputedSignal = computed(() => {
    if (this.searchByNameSignal().trim().length === 0) {
      return this.selectedParserSignal().profiles;
    }
    return this.selectedParserSignal().profiles.filter((pr) =>
      pr.name.toLowerCase().startsWith(this.searchByNameSignal().toLowerCase()),
    );
  });
  inputProperties: NewLinkInputProperties = { name: '', link: '' };
  readonly searchByNameSignal: WritableSignal<string>;

  constructor(httpService: ParsersHttpService) {
    this.selectedParserSignal = signal(ParserFactory.empty());
    this.isEditingProfilesSignal = signal(false);
    this.linkRemoved = new EventEmitter<ParserProfile>();
    this.linkAdded = new EventEmitter<ParserProfile>();
    this.searchByNameSignal = signal('');
    this._httpService = httpService;
    this.startEditingLinks = new EventEmitter<boolean>();
    this.saveEditingLinks = new EventEmitter<boolean>();
  }

  public navigateOnLinkSource(
    $event: MouseEvent,
    parserProfile: ParserProfile,
  ): void {
    $event.stopPropagation();
    window.open(parserProfile.link);
  }

  public removeLink($event: MouseEvent, parserProfile: ParserProfile): void {
    $event.stopPropagation();
    this._httpService.deleteParserProfile(parserProfile).subscribe((result) => {
      if (result.code === 200) this.linkRemoved.emit(parserProfile);
    });
  }

  public addLink($event: MouseEvent): void {
    $event.stopPropagation();
    const name = this.inputProperties.name;
    const value = this.inputProperties.link;
    const profile: ParserProfile = {
      id: '',
      parserId: this.selectedParserSignal().id,
      name: name,
      link: value,
      elapsedSeconds: 0,
      elapsedMinutes: 0,
      elapsedHours: 0,
      lastNewAdvertisementsCount: 0,
      totalElapsedSeconds: 0,
    };
    this._httpService.addParserProfile(profile).subscribe((result) => {
      if (result.code === 200) {
        this.linkAdded.emit(result.data);
      }
      this.refreshInputProperties();
    });
  }

  public handleSearchByNameInputChange($event: Event): void {
    const inputEvent = $event.target as HTMLInputElement;
    this.searchByNameSignal.set(inputEvent.value);
  }

  public startEditing($event: MouseEvent): void {
    $event.stopPropagation();
    this.startEditingLinks.emit(true);
  }

  public saveChanges($event: MouseEvent): void {
    $event.stopPropagation();
    this.saveEditingLinks.emit(false);
  }

  private refreshInputProperties(): void {
    this.inputProperties = { name: '', link: '' };
  }
}
