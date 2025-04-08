import {Component} from '@angular/core';
import {ListboxChangeEvent, ListboxModule} from 'primeng/listbox';
import {ParserProfile} from '../../types/parser-profile';
import {FormsModule} from '@angular/forms';
import {Parser} from '../../types/parser';
import {ParserPanelViewModel} from '../services/parsers-panel-viewmodel.service';
import {ArrayUtils} from '../../../../shared/utils/array-utils';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {Panel} from 'primeng/panel';
import {MessageService} from 'primeng/api';
import {ParserHttpService} from '../services/parser-http.service';
import {catchError, Observable} from 'rxjs';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {Envelope} from '../../../../shared/types/Envelope';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-profiles-list',
  imports: [ListboxModule, FormsModule, Button, InputText, Panel, Toast],
  templateUrl: './profiles-list.component.html',
  styleUrl: './profiles-list.component.scss',
  providers: [MessageService]
})
export class ProfilesListComponent {
  private readonly _messageService: MessageService;
  private readonly _httpService: ParserHttpService;
  public readonly viewModel: ParserPanelViewModel;
  public profileNameInputValue: string = '';

  public constructor(viewModel: ParserPanelViewModel, messageService: MessageService, httpService: ParserHttpService) {
    this.viewModel = viewModel;
    this._messageService = messageService;
    this._httpService = httpService;
  }

  public get profiles(): ParserProfile[] {
    const parsers: Parser[] = this.viewModel.parsers;
    console.log(parsers);
    const selectedParser: Parser | null = this.viewModel.selectedParser;
    //console.log(selectedParser);
    return selectedParser === null ? [] : selectedParser.profiles;
  }

  public profileAddButtonClick(): void {
    this.addProfile()
  }

  public profileAddEnterClick(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.addProfile();
    }
  }

  public handleProfileSelected(event: ListboxChangeEvent): void {
    const selectedParser: Parser | null = this.viewModel.selectedParser;
    if (!selectedParser) return;
    const selectedProfile: ParserProfile = event.value as ParserProfile;
    const profile: ParserProfile | null = ArrayUtils.getItem(selectedParser.profiles, pr => pr.id === selectedProfile.id);
    if (profile) this.viewModel.selectedProfile = profile;
  }

  private addProfile(): void {
    const parser: Parser | null = this.viewModel.selectedParser;
    if (!parser) return;
    this._httpService.createNewProfile(parser, this.profileNameInputValue)
      .pipe(catchError((err: any) => {
        const httpError: HttpErrorResponse = err as HttpErrorResponse;
        if (httpError.status === HttpStatusCode.BadRequest || httpError.status === HttpStatusCode.NotFound)
          this._messageService.add({ summary: 'Ошибка.', detail: httpError.error, severity: 'error', life: 5000  })
        return new Observable<never>();
      })).subscribe((response: Envelope<ParserProfile>) => {
        const profile: ParserProfile = response.data;
        this.viewModel.addProfile(profile);
        this.refreshProfileNameInput();
        this._messageService.add({ summary: 'Успешно.', detail: `Профиль ${profile.name} добавлен.`, severity: 'success', life: 3000 });
    });
  }

  private refreshProfileNameInput(): void {
    this.profileNameInputValue = '';
  }
}
