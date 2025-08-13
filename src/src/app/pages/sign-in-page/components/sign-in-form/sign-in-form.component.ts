import { Component, DestroyRef, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { StringUtils } from '../../../../shared/utils/string-utils';
import { MessageServiceUtils } from '../../../../shared/utils/message-service-utils';
import { UsersService } from '../../services/UsersService';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';

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
  private readonly _service: UsersService;
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  constructor(messageService: MessageService, service: UsersService) {
    this._messageService = messageService;
    this._service = service;
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
      return;
    }
    if (StringUtils.allEmpty([email, name])) {
      MessageServiceUtils.showError(
        this._messageService,
        'Необходимо ввести почту или псевдоним',
      );
      return;
    }
    this.authenticate(password, email, name);
  }

  private authenticate(
    password: string,
    email?: string | null,
    name?: string | null,
  ): void {
    this._service
      .authenticate(password, email, name)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (value: any): void => {
          MessageServiceUtils.showSuccess(
            this._messageService,
            'Авторизация успешна.',
          );
        },
        error: (err: HttpErrorResponse): void => {
          console.log(err);
          const message: string = err.error.message;
          MessageServiceUtils.showError(this._messageService, message);
        },
      });
  }
}
