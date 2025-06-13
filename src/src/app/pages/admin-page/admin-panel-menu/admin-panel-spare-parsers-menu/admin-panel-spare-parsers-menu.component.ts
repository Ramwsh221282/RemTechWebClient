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

@Component({
  selector: 'app-admin-panel-spare-parsers-menu',
  imports: [
    Toast,
    SpareParsersSelectComponent,
    SpareParserInfoFormComponent,
    NgIf,
    SpareParserChartsComponent,
  ],
  templateUrl: './admin-panel-spare-parsers-menu.component.html',
  styleUrl: './admin-panel-spare-parsers-menu.component.scss',
})
export class AdminPanelSpareParsersMenuComponent implements OnInit {
  private readonly _spareParsersHttpService: SpareParserHttpService;
  private readonly _spareHttpService: SparesHttpService;
  private readonly _isLoadingSignal: WritableSignal<boolean>;
  private readonly _messageService: MessageService;
  readonly spareParsersSignal: WritableSignal<SpareParser[]>;
  readonly selectedSpareParserSignal: WritableSignal<SpareParser | null>;
  readonly spareStatisticsInfo: WritableSignal<SparesStatisticalData[]>;

  constructor(
    spareParsersHttpService: SpareParserHttpService,
    spareHttpService: SparesHttpService,
    messageService: MessageService,
  ) {
    this._spareParsersHttpService = spareParsersHttpService;
    this._spareHttpService = spareHttpService;
    this.selectedSpareParserSignal = signal(null);
    this.spareParsersSignal = signal([]);
    this.spareStatisticsInfo = signal([]);
    this._isLoadingSignal = signal(false);
    this.selectedSpareParserSignal.set(null);
    this._messageService = messageService;
  }

  public ngOnInit(): void {
    this.initializeArrayFromHttpRequest();
    this.initializeStatisticalInfo();
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

  private initializeStatisticalInfo(): void {
    this._isLoadingSignal.set(true);
    this._spareHttpService
      .fetchStatistics()
      .pipe(
        finalize(() => {
          this._isLoadingSignal.set(false);
        }),
      )
      .subscribe({
        next: (value: Envelope<SparesStatisticalData[]>): void => {
          if (value.code === 200) {
            const data: SparesStatisticalData[] = value.data;
            this.spareStatisticsInfo.set(data);
          }
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
