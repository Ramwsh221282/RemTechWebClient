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
import { NgIf } from '@angular/common';
import { MessageService } from 'primeng/api';
import { catchError, finalize, Observable } from 'rxjs';
import { CustomHttpErrorFactory } from '../../../../../../shared/types/CustomHttpError';
import { MessageServiceUtils } from '../../../../../../shared/utils/message-service-utils';
import { Toast } from 'primeng/toast';
import { HttpErrorResponse } from '@angular/common/http';
import { EnvelopeErrorFactory } from '../../../../../../shared/types/EnvelopeError';

interface NewLinkInputProperties {
  name: string;
  link: string;
}

@Component({
  selector: 'app-parser-links-form',
  imports: [
    Panel,
    TableModule,
    Button,
    InputText,
    FormsModule,
    ScrollPanel,
    NgIf,
    Toast,
  ],
  templateUrl: './parser-links-form.component.html',
  styleUrl: './parser-links-form.component.scss',
})
export class ParserLinksFormComponent {
  @Output() linkRemoved: EventEmitter<ParserProfile>;
  @Output() linkAdded: EventEmitter<ParserProfile>;
  @Output() startEditingLinks: EventEmitter<boolean>;
  @Output() saveEditingLinks: EventEmitter<boolean>;
  @Output() allLinksEnabled: EventEmitter<void>;
  @Output() allLinksDisabled: EventEmitter<void>;
  @Output() updateParserLink: EventEmitter<ParserProfile>;

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

  private readonly _httpService: ParsersHttpService;
  private readonly _messageService: MessageService;

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

  constructor(httpService: ParsersHttpService, messageService: MessageService) {
    this.selectedParserSignal = signal(ParserFactory.empty());
    this.isEditingProfilesSignal = signal(false);
    this.linkRemoved = new EventEmitter<ParserProfile>();
    this.linkAdded = new EventEmitter<ParserProfile>();
    this.searchByNameSignal = signal('');
    this._httpService = httpService;
    this.startEditingLinks = new EventEmitter<boolean>();
    this.saveEditingLinks = new EventEmitter<boolean>();
    this.allLinksEnabled = new EventEmitter<void>();
    this.allLinksDisabled = new EventEmitter<void>();
    this.updateParserLink = new EventEmitter<ParserProfile>();
    this._messageService = messageService;
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
    this._httpService
      .deleteLink(parserProfile)
      .pipe(
        catchError((err: any) => {
          const error = CustomHttpErrorFactory.AsHttpError(err);
          MessageServiceUtils.showError(this._messageService, error.message);
          return new Observable<never>();
        }),
      )
      .subscribe((result) => {
        if (result.code === 200) {
          this.linkRemoved.emit(parserProfile);
          const parserName = this.selectedParserSignal().name;
          const linkName = parserProfile.name;
          const message = `Удалена ссылка: ${parserName} ${linkName}`;
          MessageServiceUtils.showSuccess(this._messageService, message);
        }
      });
  }

  public addLink(): void {
    const name = this.inputProperties.name;
    const value = this.inputProperties.link;

    const profile: ParserProfile = {
      id: '',
      parserId: this.selectedParserSignal().id,
      name: name,
      link: value,
      isEnabled: false,
      elapsedSeconds: 0,
      elapsedMinutes: 0,
      elapsedHours: 0,
      lastNewAdvertisementsCount: 0,
      totalElapsedSeconds: 0,
    };

    this._httpService
      .addLink(profile)
      .pipe(
        finalize(() => {
          this.refreshInputProperties();
        }),
      )
      .subscribe({
        next: (value): void => {
          if (value.code === 200 || value.code === 201) {
            const parserName = this.selectedParserSignal().name;
            const linkName = value.data.name;
            const message = `Добавлена ссылка: ${parserName} ${linkName}`;
            MessageServiceUtils.showSuccess(this._messageService, message);
            this.linkAdded.emit(value.data);
          }
        },
        error: (error: HttpErrorResponse): void => {
          const envelope = EnvelopeErrorFactory.fromHttpErrorResponse(error);
          const message = envelope.statusInfo;
          MessageServiceUtils.showError(this._messageService, message);
        },
      });
  }

  public disableAllParserLinks(): void {
    const parser: Parser = this.selectedParserSignal();
    const parserId: string = parser.id;
    this._httpService
      .disableAllParserLinks(parserId)
      .pipe(
        catchError((err: any) => {
          const error = CustomHttpErrorFactory.AsHttpError(err);
          MessageServiceUtils.showError(this._messageService, error.message);
          return new Observable<never>();
        }),
      )
      .subscribe((result) => {
        if (result.code === 200) {
          const parserName = this.selectedParserSignal().name;
          const message = `Выключены все ссылки: ${parserName}`;
          MessageServiceUtils.showSuccess(this._messageService, message);
          this.allLinksDisabled.emit();
        }
      });
  }

  public enableAllParserLinks(): void {
    const parser: Parser = this.selectedParserSignal();
    const parserId: string = parser.id;
    this._httpService
      .enableAllParserLinks(parserId)
      .pipe(
        catchError((err: any) => {
          const error = CustomHttpErrorFactory.AsHttpError(err);
          MessageServiceUtils.showError(this._messageService, error.message);
          return new Observable<never>();
        }),
      )
      .subscribe((result) => {
        if (result.code === 200) {
          const parserName = this.selectedParserSignal().name;
          const message = `Включены все ссылки: ${parserName}`;
          MessageServiceUtils.showSuccess(this._messageService, message);
          this.allLinksEnabled.emit();
        }
      });
  }

  public turnLink(profile: ParserProfile): void {
    const parser: Parser = this.selectedParserSignal();
    const parserId: string = parser.id;
    const profileId: string = profile.id;
    const turnTerm: boolean = !profile.isEnabled;
    this._httpService
      .updateParserLink(parserId, profileId, turnTerm)
      .pipe(
        catchError((err: any) => {
          const error = CustomHttpErrorFactory.AsHttpError(err);
          MessageServiceUtils.showError(this._messageService, error.message);
          return new Observable<never>();
        }),
      )
      .subscribe((result) => {
        if (result.code === 200) {
          const parserName = this.selectedParserSignal().name;
          const linkName = result.data.name;
          const linkActive: string = result.data.isEnabled
            ? 'Включен'
            : 'Отключен';
          const message: string = `Изменено состояние ссылки: ${parserName} ${linkName} ${linkActive}`;
          MessageServiceUtils.showSuccess(this._messageService, message);
          this.updateParserLink.emit(result.data);
        }
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
