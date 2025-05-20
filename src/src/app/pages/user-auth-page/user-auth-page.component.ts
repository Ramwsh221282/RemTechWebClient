import { Component, signal, WritableSignal } from '@angular/core';
import { UsersService } from '../../shared/services/users.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { StringUtils } from '../../shared/utils/string-utils';
import { MessageServiceUtils } from '../../shared/utils/message-service-utils';
import { AuthDto } from '../../shared/services/auth-dto';
import { catchError, finalize, Observable } from 'rxjs';
import { CustomHttpErrorFactory } from '../../shared/types/CustomHttpError';
import { Envelope } from '../../shared/types/Envelope';
import { AuthResponse } from '../../shared/services/auth-response';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Panel } from 'primeng/panel';
import { InputText } from 'primeng/inputtext';
import { Toast } from 'primeng/toast';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-auth-page',
  imports: [
    Button,
    ProgressSpinner,
    Panel,
    InputText,
    ReactiveFormsModule,
    Toast,
    RouterLink,
  ],
  templateUrl: './user-auth-page.component.html',
  styleUrl: './user-auth-page.component.scss',
  providers: [MessageService],
})
export class UserAuthPageComponent {
  private readonly _httpService: UsersService;
  private readonly _messageService: MessageService;

  readonly isLoading: WritableSignal<boolean>;
  readonly isSuccess: WritableSignal<boolean>;
  readonly authForm: FormGroup;

  constructor(httpService: UsersService, messageService: MessageService) {
    this._messageService = messageService;
    this._httpService = httpService;
    this.isLoading = signal(false);
    this.isSuccess = signal(false);
    this.authForm = new FormGroup({
      email: new FormControl(),
      userName: new FormControl(),
      password: new FormControl(),
    });
  }

  public authSubmit(): void {
    const formValues = this.authForm.value;

    const email: string = formValues.email ?? '';
    const userName: string = formValues.userName ?? '';
    const password: string = formValues.password ?? '';

    if (
      StringUtils.isEmptyOrWhiteSpace(email) &&
      StringUtils.isEmptyOrWhiteSpace(userName)
    ) {
      const message =
        'Для авторизации необходимо указать почту или название учётной записи.';
      MessageServiceUtils.showError(this._messageService, message);
      return;
    }

    if (StringUtils.isEmptyOrWhiteSpace(password)) {
      const message = 'Необходимо указать пароль для авторизации';
      MessageServiceUtils.showError(this._messageService, message);
      return;
    }

    const dto: AuthDto = {
      email: email,
      password: password,
      username: userName,
    };
    this.performAuthorization(dto);
  }

  private performAuthorization(dto: AuthDto): void {
    this.isLoading.set(true);
    this._httpService
      .auth(dto)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
        catchError((err: any) => {
          const customError = CustomHttpErrorFactory.AsHttpError(err);
          MessageServiceUtils.showError(
            this._messageService,
            customError.message,
          );
          return new Observable<never>();
        }),
      )
      .subscribe((envelope) => {
        if (envelope.code === 200) {
          this.isSuccess.set(true);
          const message = 'Успешная авторизация.';
          MessageServiceUtils.showSuccess(this._messageService, message);
        }
      });
  }
}
