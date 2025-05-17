import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { MailingSender } from '../types/mailing-sender';
import { DataView } from 'primeng/dataview';
import { NgForOf } from '@angular/common';
import { ScrollPanel } from 'primeng/scrollpanel';
import { AdminMailingServiceItemListComponent } from './admin-mailing-service-item-list/admin-mailing-service-item-list.component';
import { Panel } from 'primeng/panel';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-admin-panel-mailing-service-senders-list',
  imports: [
    DataView,
    NgForOf,
    ScrollPanel,
    AdminMailingServiceItemListComponent,
    Panel,
    ProgressSpinner,
  ],
  templateUrl: './admin-panel-mailing-service-senders-list.component.html',
  styleUrl: './admin-panel-mailing-service-senders-list.component.scss',
})
export class AdminPanelMailingServiceSendersListComponent {
  @Output() pingClicked: EventEmitter<MailingSender>;
  @Output() priorityUpClicked: EventEmitter<MailingSender>;
  @Output() priorityDownClicked: EventEmitter<MailingSender>;
  @Output() turnClicked: EventEmitter<MailingSender>;
  @Output() removeClicked: EventEmitter<MailingSender>;

  @Input({ required: true, alias: 'isLoading' }) set _isLoading(
    value: boolean,
  ) {
    this.isLoadingSignal.set(value);
  }

  @Input({ required: true, alias: 'senders' }) set _senders(
    value: MailingSender[],
  ) {
    this.mailingSendersSignal.set(value);
  }

  readonly isLoadingSignal: WritableSignal<boolean>;
  readonly mailingSendersSignal: WritableSignal<MailingSender[]>;

  constructor() {
    this.isLoadingSignal = signal(false);
    this.mailingSendersSignal = signal([]);
    this.pingClicked = new EventEmitter<MailingSender>();
    this.priorityUpClicked = new EventEmitter<MailingSender>();
    this.priorityDownClicked = new EventEmitter<MailingSender>();
    this.turnClicked = new EventEmitter<MailingSender>();
    this.removeClicked = new EventEmitter<MailingSender>();
  }
}
