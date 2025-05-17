import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { AdminPanelMailingServiceTitleComponent } from './admin-panel-mailing-service-title/admin-panel-mailing-service-title.component';
import {
  CreateMailingSenderDto,
  CreateMailingSenderValidation,
  MailingSender,
} from './types/mailing-sender';
import { MailingServiceHttpService } from './services/mailing-service-http.service';
import { catchError, finalize, Observable } from 'rxjs';
import { AdminPanelMailingServiceSendersListComponent } from './admin-panel-mailing-service-senders-list/admin-panel-mailing-service-senders-list.component';
import { AdminMailingServiceEditingPanelComponent } from './admin-panel-mailing-service-senders-list/admin-mailing-service-editing-panel/admin-mailing-service-editing-panel.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessageServiceUtils } from '../../../../shared/utils/message-service-utils';
import { Toast } from 'primeng/toast';
import { CustomHttpErrorFactory } from '../../../../shared/types/CustomHttpError';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationDialogUtils } from '../../../../shared/utils/confirmation-dialog-utils';
import { AdminMailingServiceGoogleInstructionsComponent } from './admin-mailing-service-google-instructions/admin-mailing-service-google-instructions.component';
import { AdminMailingServiceYandexInstructionsComponent } from './admin-mailing-service-yandex-instructions/admin-mailing-service-yandex-instructions.component';
import { AdminMailingServiceMailruInstructionsComponent } from './admin-mailing-service-mailru-instructions/admin-mailing-service-mailru-instructions.component';

@Component({
  selector: 'app-admin-panel-mailing-service-menu',
  imports: [
    AdminPanelMailingServiceTitleComponent,
    AdminPanelMailingServiceSendersListComponent,
    AdminMailingServiceEditingPanelComponent,
    Toast,
    ConfirmDialog,
    AdminMailingServiceGoogleInstructionsComponent,
    AdminMailingServiceYandexInstructionsComponent,
    AdminMailingServiceMailruInstructionsComponent,
  ],
  templateUrl: './admin-panel-mailing-service-menu.component.html',
  styleUrl: './admin-panel-mailing-service-menu.component.scss',
})
export class AdminPanelMailingServiceMenuComponent implements OnInit {
  private readonly _httpService: MailingServiceHttpService;
  private readonly _messageService: MessageService;
  private readonly _confirmationService: ConfirmationService;

  readonly isLoadingSignal: WritableSignal<boolean>;
  readonly mailingSendersSignal: WritableSignal<MailingSender[]>;
  readonly senderToRemove: WritableSignal<MailingSender | null>;

  readonly googleInstructionsOpened: WritableSignal<boolean>;
  readonly yandexInstructionsOpened: WritableSignal<boolean>;
  readonly mailRuInstructionsOpened: WritableSignal<boolean>;

  constructor(
    httpService: MailingServiceHttpService,
    messageService: MessageService,
    confirmationService: ConfirmationService,
  ) {
    this._httpService = httpService;
    this._messageService = messageService;
    this._confirmationService = confirmationService;

    this.isLoadingSignal = signal(false);
    this.mailingSendersSignal = signal([]);
    this.senderToRemove = signal(null);

    this.googleInstructionsOpened = signal(false);
    this.yandexInstructionsOpened = signal(false);
    this.mailRuInstructionsOpened = signal(false);
  }

  public ngOnInit(): void {
    this.isLoadingSignal.set(true);
    this._httpService
      .fetchMailingSenders()
      .pipe(
        finalize(() => {
          this.isLoadingSignal.set(false);
        }),
      )
      .subscribe((response) => {
        if (response.code === 200) {
          const data: MailingSender[] = response.data;
          this.mailingSendersSignal.set(data);
        }
      });
  }

  public onAddNewSenderSubmit(dto: CreateMailingSenderDto): void {
    if (CreateMailingSenderValidation.isEmailEmpty(dto)) {
      MessageServiceUtils.showError(this._messageService, 'Почта не указана');
      return;
    }

    if (CreateMailingSenderValidation.isPasswordEmpty(dto)) {
      MessageServiceUtils.showError(
        this._messageService,
        'Неподдерживаемый почтовый провайдер.',
      );
      return;
    }

    if (CreateMailingSenderValidation.isServiceNameEmpty(dto)) {
      MessageServiceUtils.showError(
        this._messageService,
        'Почтовый сервис не распознан.',
      );
      return;
    }

    if (CreateMailingSenderValidation.isEmailNotCompatible(dto)) {
      MessageServiceUtils.showError(
        this._messageService,
        'Почтовый сервис не поддерживается.',
      );
      return;
    }

    this.isLoadingSignal.set(true);
    this._httpService
      .createMailingSender(dto)
      .pipe(
        finalize(() => this.isLoadingSignal.set(false)),
        catchError((err) => {
          const error = CustomHttpErrorFactory.AsHttpError(err);
          MessageServiceUtils.showError(this._messageService, error.message);
          return new Observable<never>();
        }),
      )
      .subscribe((response) => {
        if (response.code === 200 || response.code === 201) {
          const sender = response.data;
          const currentProviders = this.mailingSendersSignal();
          const updatedProviders = [sender, ...currentProviders];
          this.mailingSendersSignal.set(updatedProviders);
          MessageServiceUtils.showSuccess(
            this._messageService,
            `Добавлен почтовый провайдер: ${sender.email} ${sender.serviceName}`,
          );
        } else
          MessageServiceUtils.showError(
            this._messageService,
            response.statusInfo,
          );
      });
  }

  public onMailingSenderPing(sender: MailingSender): void {
    const email = 'jimkrauz@gmail.com';

    MessageServiceUtils.showInfo(
      this._messageService,
      `Отправка сообщения на: ${email}`,
    );

    this._httpService
      .pingMailingSender(sender, email)
      .pipe(
        catchError((err: any) => {
          const error = CustomHttpErrorFactory.AsHttpError(err);
          MessageServiceUtils.showError(this._messageService, error.message);
          return new Observable<never>();
        }),
      )
      .subscribe((response) => {
        if (response.code === 200) {
          MessageServiceUtils.showInfo(
            this._messageService,
            `На почту ${email} отправлено тестовое сообщение.`,
          );
        }
      });
  }

  public onMailingSenderPriorityUp(sender: MailingSender): void {
    if (sender.priority === 1) {
      MessageServiceUtils.showError(
        this._messageService,
        'Нельзя повысить приоритет выше 1.',
      );
      return;
    }

    const id = sender.id;
    const senders = this.mailingSendersSignal();
    const indexOfCurrent = senders.findIndex((s) => s.id === id);

    if (indexOfCurrent === -1) {
      MessageServiceUtils.showError(
        this._messageService,
        'Не удается найти почтового отправителя.',
      );
      return;
    }

    const indexForPrevious = indexOfCurrent - 1;

    const tempNeighbour = { ...senders[indexForPrevious] };
    const tempTarget = {
      ...senders[indexOfCurrent],
      priority: tempNeighbour.priority,
    };
    tempNeighbour.priority = sender.priority;

    senders[indexOfCurrent] = tempTarget;
    senders[indexForPrevious] = tempNeighbour;

    this.updatePriorities(senders);
  }

  public onMailingSenderPriorityDown(sender: MailingSender): void {
    const senders = this.mailingSendersSignal();
    if (sender.id === senders[senders.length - 1].id) {
      MessageServiceUtils.showError(
        this._messageService,
        `Нельзя понизить приоритет ниже последнего.`,
      );
      return;
    }

    const id = sender.id;
    const indexOfCurrent = senders.findIndex((s) => s.id === id);

    if (indexOfCurrent === -1) {
      MessageServiceUtils.showError(
        this._messageService,
        'Не удается найти почтового отправителя.',
      );
      return;
    }

    const indexForNext = indexOfCurrent + 1;

    const tempNeighbour = { ...senders[indexForNext] };
    const tempTarget = {
      ...senders[indexOfCurrent],
      priority: tempNeighbour.priority,
    };

    tempNeighbour.priority = sender.priority;

    senders[indexOfCurrent] = tempTarget;
    senders[indexForNext] = tempNeighbour;

    this.updatePriorities(senders);
  }

  public onMailingSenderActivityTurn(sender: MailingSender): void {
    const senders = this.mailingSendersSignal();
    const index = senders.findIndex((s) => s.id === sender.id);

    if (index === -1) {
      MessageServiceUtils.showError(
        this._messageService,
        'Не удается найти почтового отправителя.',
      );
      return;
    }

    this._httpService
      .turnSenderActivity(sender)
      .pipe(
        catchError((err) => {
          const error = CustomHttpErrorFactory.AsHttpError(err);
          MessageServiceUtils.showError(this._messageService, error.message);
          return new Observable<never>();
        }),
      )
      .subscribe((response) => {
        if (response.code === 200) {
          const updated = response.data;
          const message = `Почтовый отправитель: ${updated.isActive ? 'Включен' : 'Отключен'}`;
          MessageServiceUtils.showSuccess(this._messageService, message);
          senders[index] = { ...updated };
          this.mailingSendersSignal.set(senders);
        }
      });
  }

  public onMailingSenderRemove(sender: MailingSender): void {
    this.senderToRemove.set(sender);
    this._confirmationService.confirm(
      ConfirmationDialogUtils.createBasicConfirmationProps(
        `Удалить почтового отправителя: ${sender.email} ${sender.serviceName} ?`,
        'Подтверждение',
        (): void => {
          const sender = this.senderToRemove();
          if (!sender) {
            MessageServiceUtils.showError(
              this._messageService,
              'Ошибка на уровне приложения.',
            );
            return;
          }

          this.isLoadingSignal.set(true);
          this._httpService
            .removeSender(sender)
            .pipe(
              finalize(() => this.isLoadingSignal.set(false)),
              catchError((err) => {
                const error = CustomHttpErrorFactory.AsHttpError(err);
                MessageServiceUtils.showError(
                  this._messageService,
                  error.message,
                );
                this.senderToRemove.set(null);
                return new Observable<never>();
              }),
            )
            .subscribe((response) => {
              if (response.code === 200) {
                const id = response.data;
                const senders = this.mailingSendersSignal().filter(
                  (s) => s.id !== id,
                );
                this.mailingSendersSignal.set(senders);
                MessageServiceUtils.showSuccess(
                  this._messageService,
                  `Удален почтовый отправитель: ${sender.email} ${sender.serviceName}`,
                );
                this.senderToRemove.set(null);
              }
            });
        },
        (): void => {
          MessageServiceUtils.showInfo(
            this._messageService,
            'Удаление отменено.',
          );
          this.senderToRemove.set(null);
        },
      ),
    );
  }

  private updatePriorities(senders: MailingSender[]): void {
    const sorted = senders.sort((a, b) => a.priority - b.priority);
    const identifiers = sorted.map((item) => item.id);
    this._httpService
      .updateSenderPriorities(identifiers)
      .pipe(
        catchError((err) => {
          const error = CustomHttpErrorFactory.AsHttpError(err);
          MessageServiceUtils.showError(this._messageService, error.message);
          return new Observable<never>();
        }),
      )
      .subscribe((response) => {
        if (response.code === 200) {
          this.mailingSendersSignal.set(sorted);
          MessageServiceUtils.showSuccess(
            this._messageService,
            'Порядок приоритетов изменен.',
          );
        }
      });
  }

  public googleInstructionsOpen(): void {
    this.googleInstructionsOpened.set(true);
  }

  public googleInstructionsClose(): void {
    this.googleInstructionsOpened.set(false);
  }

  public yandexInstructionsOpen(): void {
    this.yandexInstructionsOpened.set(true);
  }

  public yandexInstructionsClose(): void {
    this.yandexInstructionsOpened.set(false);
  }

  public mailRuInstructionsOpen(): void {
    this.mailRuInstructionsOpened.set(true);
  }

  public mailRuInstructionsClose(): void {
    this.mailRuInstructionsOpened.set(false);
  }
}
