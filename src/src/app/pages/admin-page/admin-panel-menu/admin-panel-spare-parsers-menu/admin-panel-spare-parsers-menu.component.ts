import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { SpareParser } from './models/spare-parser-ts';
import { SpareParserHttpService } from './services/spare-parser-http.service';
import { Envelope } from '../../../../shared/types/Envelope';
import { EnvelopeErrorFactory } from '../../../../shared/types/EnvelopeError';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { MessageServiceUtils } from '../../../../shared/utils/message-service-utils';
import { Toast } from 'primeng/toast';
import { SpareParsersSelectComponent } from './components/spare-parsers-select/spare-parsers-select.component';
import { SpareParserInfoFormComponent } from './components/spare-parser-info-form/spare-parser-info-form.component';
import { NgIf } from '@angular/common';
import { SparesStatisticalData } from './models/spares-statistical-data';
import { SparesHttpService } from './services/spares-http.service';
import { SpareParserChartsComponent } from './components/spare-parser-charts/spare-parser-charts.component';
import { Title } from '@angular/platform-browser';
import { SpareParserUpdateDetails } from './models/spare-parser-update-details';
import { ArrayUtils } from '../../../../shared/utils/array-utils';
import { SpareParserLinksFormComponent } from './components/spare-parser-links-form/spare-parser-links-form.component';

@Component({
  selector: 'app-admin-panel-spare-parsers-menu',
  imports: [
    Toast,
    SpareParsersSelectComponent,
    SpareParserInfoFormComponent,
    NgIf,
    SpareParserChartsComponent,
    SpareParserLinksFormComponent,
  ],
  templateUrl: './admin-panel-spare-parsers-menu.component.html',
  styleUrl: './admin-panel-spare-parsers-menu.component.scss',
})
export class AdminPanelSpareParsersMenuComponent implements OnInit {
  private readonly _spareParsersHttpService: SpareParserHttpService;
  private readonly _isLoadingSignal: WritableSignal<boolean>;
  private readonly _messageService: MessageService;
  readonly spareParsersSignal: WritableSignal<SpareParser[]>;
  readonly selectedSpareParserSignal: WritableSignal<SpareParser | null>;

  constructor(
    spareParsersHttpService: SpareParserHttpService,
    messageService: MessageService,
    title: Title,
  ) {
    title.setTitle('Администрирование. Парсеры запчастей');
    this._spareParsersHttpService = spareParsersHttpService;
    this.selectedSpareParserSignal = signal(null);
    this.spareParsersSignal = signal([]);
    this._isLoadingSignal = signal(false);
    this.selectedSpareParserSignal.set(null);
    this._messageService = messageService;
  }

  public ngOnInit(): void {
    this.initializeArrayFromHttpRequest();
    // this.initializeStatisticalInfo();
  }

  private initializeArrayFromHttpRequest(): void {
    this._isLoadingSignal.set(true);
    this._spareParsersHttpService
      .fetchAll()
      .pipe(
        finalize(() => {
          this._isLoadingSignal.set(false);
        }),
      )
      .subscribe({
        next: (value: Envelope<SpareParser[]>): void => {
          if (value.code === 200) {
            const data: SpareParser[] = value.data;
            this.spareParsersSignal.set(data);
            const first = data[0];
            this.selectedSpareParserSignal.set(first);
          }
        },
        error: (error: HttpErrorResponse) => {
          const envelope = EnvelopeErrorFactory.fromHttpErrorResponse(error);
          const message = envelope.statusInfo;
          MessageServiceUtils.showError(this._messageService, message);
        },
      });
  }

  public handleSaveChangesOnUpdate(details: SpareParserUpdateDetails): void {
    this._isLoadingSignal.set(true);
    this._spareParsersHttpService
      .update(details)
      .pipe(
        finalize(() => {
          this._isLoadingSignal.set(false);
        }),
      )
      .subscribe({
        next: (envelope: Envelope<SpareParser>) => {
          const updated: SpareParser = envelope.data;
          const current = this.spareParsersSignal();
          const index = current.findIndex(
            (item: SpareParser) => item.name === updated.name,
          );
          if (index < 0) {
            this.triggerError('Ошибка на уровне приложения');
            return;
          }
          const updatedArray = ArrayUtils.updateItemByIndex(
            updated,
            current,
            (item) => item.name === updated.name,
          );
          this.spareParsersSignal.set(updatedArray);
          this.triggerSuccess(`Изменён парсер запчастей: ${updated.name}`);
        },
        error: (error: HttpErrorResponse) => {
          const envelope = EnvelopeErrorFactory.fromHttpErrorResponse(error);
          const message = envelope.statusInfo;
          MessageServiceUtils.showError(this._messageService, message);
        },
      });
  }

  public handleInstantlyActivate($event: SpareParser): void {
    this._isLoadingSignal.set(true);
    this._spareParsersHttpService
      .instantlyActivate($event)
      .pipe(
        finalize(() => {
          this._isLoadingSignal.set(false);
        }),
      )
      .subscribe({
        next: (envelope: Envelope<SpareParser>) => {
          const updated: SpareParser = envelope.data;
          const current = this.spareParsersSignal();
          const index = current.findIndex(
            (item: SpareParser) => item.name === updated.name,
          );
          if (index < 0) {
            this.triggerError('Ошибка на уровне приложения');
            return;
          }
          const updatedArray = ArrayUtils.updateItemByIndex(
            updated,
            current,
            (item) => item.name === updated.name,
          );
          this.spareParsersSignal.set(updatedArray);
          this.triggerSuccess(`Парсер запчастей активирован: ${updated.name}`);
        },
        error: (error: HttpErrorResponse) => {
          const envelope = EnvelopeErrorFactory.fromHttpErrorResponse(error);
          const message = envelope.statusInfo;
          MessageServiceUtils.showError(this._messageService, message);
        },
      });
  }

  public triggerSuccess(message: string): void {
    MessageServiceUtils.showSuccess(this._messageService, message);
  }

  public triggerError(message: string): void {
    MessageServiceUtils.showError(this._messageService, message);
  }
}
