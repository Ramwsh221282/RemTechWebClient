import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  MailingSender,
  MailingSenderFactory,
} from '../../types/mailing-sender';
import { NgOptimizedImage } from '@angular/common';
import { Divider } from 'primeng/divider';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-admin-mailing-service-item-list',
  imports: [NgOptimizedImage, Divider, Button],
  templateUrl: './admin-mailing-service-item-list.component.html',
  styleUrl: './admin-mailing-service-item-list.component.scss',
})
export class AdminMailingServiceItemListComponent {
  @Output() pingClicked: EventEmitter<MailingSender>;
  @Output() priorityUpClicked: EventEmitter<MailingSender>;
  @Output() priorityDownClicked: EventEmitter<MailingSender>;
  @Output() turnClicked: EventEmitter<MailingSender>;
  @Output() removeClicked: EventEmitter<MailingSender>;

  @Input({ required: true, alias: 'sender' }) set _sender(
    value: MailingSender,
  ) {
    this.senderSignal.set(value);
  }

  readonly senderSignal: WritableSignal<MailingSender>;

  constructor() {
    this.senderSignal = signal(MailingSenderFactory.default());
    this.pingClicked = new EventEmitter<MailingSender>();
    this.priorityUpClicked = new EventEmitter<MailingSender>();
    this.priorityDownClicked = new EventEmitter<MailingSender>();
    this.turnClicked = new EventEmitter<MailingSender>();
    this.removeClicked = new EventEmitter<MailingSender>();
  }

  public getAppropriateIcon(): string {
    const email = this.senderSignal().email;
    if (email.endsWith('gmail.com')) return 'mailing_images/google_mail.svg';
    if (email.endsWith('mail.ru')) return 'mailing_images/mailru_mail.svg';
    return 'mailing_images/yandex_mail.svg';
  }

  public onPingClicked($event: MouseEvent) {
    $event.stopPropagation();
    this.pingClicked.emit(this.senderSignal());
  }

  public onPriorityUpClicked($event: MouseEvent) {
    $event.stopPropagation();
    this.priorityUpClicked.emit(this.senderSignal());
  }

  public onPriorityDownClicked($event: MouseEvent) {
    $event.stopPropagation();
    this.priorityDownClicked.emit(this.senderSignal());
  }

  public onTurnClicked($event: MouseEvent) {
    $event.stopPropagation();
    this.turnClicked.emit(this.senderSignal());
  }

  public onRemoveClicked($event: MouseEvent) {
    $event.stopPropagation();
    this.removeClicked.emit(this.senderSignal());
  }
}
