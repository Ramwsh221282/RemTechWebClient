import {
  Component,
  EventEmitter,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { Panel } from 'primeng/panel';
import { ScrollPanel } from 'primeng/scrollpanel';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CreateMailingSenderDto } from '../../types/mailing-sender';

@Component({
  selector: 'app-admin-mailing-service-editing-panel',
  imports: [Panel, ScrollPanel, InputText, Button, ReactiveFormsModule],
  templateUrl: './admin-mailing-service-editing-panel.component.html',
  styleUrl: './admin-mailing-service-editing-panel.component.scss',
})
export class AdminMailingServiceEditingPanelComponent {
  @Output() createSenderSubmitted: EventEmitter<CreateMailingSenderDto>;
  readonly isEditingSignal: WritableSignal<boolean>;

  private readonly _google: string = 'Google - gmail.com';
  private readonly _mailRu: string = 'Mail Ru - mail.ru';
  private readonly _yandex: string = 'Yandex - yandex.ru';

  addSenderForm = new FormGroup({
    email: new FormControl(''),
    smtpKey: new FormControl(''),
    serviceName: new FormControl(''),
  });

  constructor() {
    this.isEditingSignal = signal(false);
    this.createSenderSubmitted = new EventEmitter<CreateMailingSenderDto>();
  }

  public submitAdding(): void {
    const formValues = this.addSenderForm.value;

    const senderEmail: string = formValues.email ?? '';
    const senderSmtpKey: string = formValues.smtpKey ?? '';
    const serviceName: string = formValues.serviceName ?? '';

    const createSenderDto: CreateMailingSenderDto = {
      serviceEmail: senderEmail,
      serviceName: serviceName,
      smtpKey: senderSmtpKey,
    };

    this.addSenderForm.reset();
    this.createSenderSubmitted.emit(createSenderDto);
  }

  public onEmailInputChange(): void {
    const emailInput = this.addSenderForm.get('email')?.value;

    if (!emailInput) return;

    if (emailInput.endsWith('gmail.com'))
      this.addSenderForm.get('serviceName')?.setValue(this._google);

    if (emailInput.endsWith('yandex.ru'))
      this.addSenderForm.get('serviceName')?.setValue(this._yandex);

    if (emailInput.endsWith('mail.ru'))
      this.addSenderForm.get('serviceName')?.setValue(this._mailRu);
  }
}
