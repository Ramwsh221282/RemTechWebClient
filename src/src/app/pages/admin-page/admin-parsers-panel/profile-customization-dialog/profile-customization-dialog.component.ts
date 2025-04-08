import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {
  DialogContainerComponent
} from '../../../../shared/components/dialog/dialog-container/dialog-container.component';
import {ParserProfile, ParserProfileFactory} from '../../types/parser-profile';
import {DialogContentComponent} from '../../../../shared/components/dialog/dialog-content/dialog-content.component';
import {DialogHeaderComponent} from '../../../../shared/components/dialog/dialog-header/dialog-header.component';
import {FormsModule} from '@angular/forms';
import {DialogFooterComponent} from '../../../../shared/components/dialog/dialog-footer/dialog-footer.component';
import {Button} from 'primeng/button';
import {TabsModule} from 'primeng/tabs';
import {TableModule} from 'primeng/table';
import {ProfileDataTabContentComponent} from './profile-data-tab-content/profile-data-tab-content.component';
import {ProfileLinksTabContentComponent} from './profile-links-tab-content/profile-links-tab-content.component';
import {ParserHttpService} from '../services/parser-http.service';
import {Parser, ParserFactory} from '../../types/parser';
import {catchError, Observable} from 'rxjs';
import {MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';
import {HttpErrorResponse, HttpStatusCode} from '@angular/common/http';
import {ParserPanelViewModel} from '../services/parsers-panel-viewmodel.service';
import {StyleClass} from 'primeng/styleclass';

@Component({
  selector: 'app-profile-customization-dialog',
  imports: [
    DialogContainerComponent,
    DialogContentComponent,
    DialogHeaderComponent,
    FormsModule,
    DialogFooterComponent,
    Button,
    TabsModule,
    TableModule,
    ProfileDataTabContentComponent,
    ProfileLinksTabContentComponent,
    Toast,
    StyleClass
  ],
  templateUrl: './profile-customization-dialog.component.html',
  styleUrl: './profile-customization-dialog.component.scss',
  providers: [MessageService]
})
export class ProfileCustomizationDialogComponent implements OnInit {
  @Input({required: true}) visibility: boolean = false;
  @Output() onClose: EventEmitter<void> = new EventEmitter();
  private readonly _httpService: ParserHttpService = inject(ParserHttpService);
  private readonly _viewModel: ParserPanelViewModel;
  private readonly _messageService: MessageService

  private _profileBackup: ParserProfile;
  private _profileCopy: ParserProfile;

  public constructor(httpService: ParserHttpService, viewModel: ParserPanelViewModel, messageService: MessageService) {
    this._httpService = httpService;
    this._viewModel = viewModel;
    this._messageService = messageService;
    this._profileCopy = ParserProfileFactory.empty();
    this._profileBackup = ParserProfileFactory.empty();
  }

  public ngOnInit(): void {
    const profile: ParserProfile | null = this._viewModel.selectedProfile;
    if (profile) {
      this._profileCopy = {...profile }
      this._profileBackup = {...profile }
    }
  }

  public get profileCopy(): ParserProfile {
    return this._profileCopy;
  }

  public handleProfileDataChange(updatedProfile: ParserProfile): void {
    this._profileCopy = {...updatedProfile };
  }

  public submitProfileChanges(): void {
    const parser: Parser | null = this._viewModel.selectedParser;
    if (!parser) return;

    this._httpService.updateProfile(this._profileBackup, parser, this._profileCopy)
      .pipe(catchError((err) => {
        const httpError = err as HttpErrorResponse;
        if (httpError.status === HttpStatusCode.BadRequest)
          this._messageService
            .add({ summary: 'Ошибка.', detail: httpError.error, severity: 'error', life: 5000  })
        this._profileCopy = {...this._profileBackup};
        return new Observable<never>();
      }))
      .subscribe(_ => {
        this._messageService
          .add({ summary: 'Успешно.', detail: `Профиль ${this._profileBackup.name} обновлён.`, severity: 'success', life: 3000 });
        this._viewModel.updateProfile(this._profileCopy)
      });
  }

  public getProfileEditingHeader(): string {
    return `Редактирование: ${this._profileCopy.name}.`
  }

  public closeClick(): void {
    this.onClose.emit();
  }
}
