import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { StringUtils } from '../../../../shared/utils/string-utils';
import { MessageServiceUtils } from '../../../../shared/utils/message-service-utils';

@Component({
  selector: 'app-sign-in-form',
  imports: [ReactiveFormsModule, Toast],
  templateUrl: './sign-in-form.component.html',
  styleUrl: './sign-in-form.component.scss',
  providers: [MessageService],
})
export class SignInFormComponent {
  signIngForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    name: new FormControl(''),
    password: new FormControl(''),
  });

  private readonly _messageService: MessageService;

  constructor(messageService: MessageService) {
    this._messageService = messageService;
  }

  public submit(): void {
    const formValues = this.signIngForm.value;
    const email: string = formValues.email;
    const name: string = formValues.name;
    const password: string = formValues.password;
    if (StringUtils.isEmptyOrWhiteSpace(password)) {
      MessageServiceUtils.showError(
        this._messageService,
        'Необходимо ввести пароль.',
      );
    }
    if (StringUtils.isEmptyOrWhiteSpace(email && name)) {
      MessageServiceUtils.showError(
        this._messageService,
        'Необходимо ввести почту или псевдоним',
      );
    }
  }
}
