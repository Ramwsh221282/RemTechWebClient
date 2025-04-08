import {Component} from '@angular/core';
import {ParserProfile} from '../../types/parser-profile';
import {ButtonModule} from 'primeng/button';
import {
  ProfileCustomizationDialogComponent
} from '../profile-customization-dialog/profile-customization-dialog.component';
import {NgIf} from '@angular/common';
import {ParserPanelViewModel} from '../services/parsers-panel-viewmodel.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ParserHttpService} from '../services/parser-http.service';
import {Toast} from 'primeng/toast';
import {ConfirmPopup} from 'primeng/confirmpopup';
import {Parser} from '../../types/parser';
import {catchError, Observable} from 'rxjs';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {Envelope} from '../../../../shared/types/Envelope';

@Component({
  selector: 'app-profile-info',
  imports: [ButtonModule, ProfileCustomizationDialogComponent, NgIf, Toast, ConfirmPopup],
  templateUrl: './profile-info.component.html',
  styleUrl: './profile-info.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class ProfileInfoComponent {
  public readonly viewModel: ParserPanelViewModel;
  private readonly _httpService: ParserHttpService;
  private readonly _confirmationService: ConfirmationService;
  private readonly _messageService: MessageService;
  private _isCustomizationDialogOpen: boolean = false;

  public constructor(
    viewModel: ParserPanelViewModel,
    httpService: ParserHttpService,
    confirmationService: ConfirmationService,
    messageService: MessageService) {
    this.viewModel = viewModel;
    this._httpService = httpService;
    this._confirmationService = confirmationService;
    this._messageService = messageService;
  }

  public get isCustomizationDialogOpen(): boolean {
    return this._isCustomizationDialogOpen;
  }

  public getRepeatEveryHours(): string {
    const profile: ParserProfile | null = this.viewModel.selectedProfile;
    if (!profile) return 'Профиль не выбран.';
    if (profile.repeatEveryHours === 0) return 'Не установлено.';
    return `${profile.repeatEveryHours} ч.`;
  }

  public getLinksTextInformation(): string {
    const profile: ParserProfile | null = this.viewModel.selectedProfile;
    if (!profile) return 'Профиль не выбран.';
    if (profile.links.length === 0) return 'Нет ссылок.';
    if (profile.links.length === 1) return '1 ссылка.'
    if (profile.links.length === 2) return '2 ссылки.'
    if (profile.links.length === 3) return '3 ссылки.'
    return `${profile.links.length} ссылок.`
  }

  public getProfileState(): string {
    const profile: ParserProfile | null = this.viewModel.selectedProfile;
    if (!profile) return 'Профиль не выбран.';
    return profile.state;
  }

  public getProfileName(): string {
    const profile: ParserProfile | null = this.viewModel.selectedProfile;
    if (!profile) return 'Профиль не выбран.';
    return profile.name;
  }

  public setCustomizationDialogClose(): void {
    this._isCustomizationDialogOpen = false;
  }

  public setCustomizationDialogOpen(): void {
    this._isCustomizationDialogOpen = true;
  }

  public removeButtonClick(event: Event): void {
    const parser: Parser | null = this.viewModel.selectedParser;
    if (!parser) return;
    const profile: ParserProfile | null = this.viewModel.selectedProfile;
    if (!profile) return;

    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Вы действительно хотите удалить профиль: ${profile.name}?`,
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Нет',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Да',
        severity: 'danger',
      },
      accept: () => {
        this.removeProfile(profile, parser);
      },
      reject: () => {

      }
    })
  }

  private removeProfile(profile: ParserProfile, parser: Parser): void {
    this._httpService.deleteProfile(parser, profile).pipe(catchError((err: any)=> {

      const httpErrorResponse: HttpErrorResponse = err as HttpErrorResponse;

      if (httpErrorResponse.status === HttpStatusCode.BadRequest || httpErrorResponse.status === HttpStatusCode.NotFound)
        this._messageService.add({ summary: 'Ошибка.', detail: httpErrorResponse.error, severity: 'error', life: 5000  })

      return new Observable<never>();

    })).subscribe((_: Envelope<string>) => {

      this._messageService
        .add({ summary: 'Успешно.', detail: `Профиль ${profile.name} удалён из ${parser.name}.`, severity: 'success', life: 3000 });

      this.viewModel.removeProfile(profile);

    });
  }
}
