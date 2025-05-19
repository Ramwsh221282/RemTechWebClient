import { Component, signal, WritableSignal } from '@angular/core';
import { Panel } from 'primeng/panel';
import { InputText } from 'primeng/inputtext';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserRegisterDto } from '../../shared/services/user-register-dto';
import { Button } from 'primeng/button';
import { UsersService } from '../../shared/services/users.service';
import { StringUtils } from '../../shared/utils/string-utils';
import { MessageServiceUtils } from '../../shared/utils/message-service-utils';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ProgressSpinner } from 'primeng/progressspinner';
import { catchError, finalize, Observable } from 'rxjs';
import { CustomHttpErrorFactory } from '../../shared/types/CustomHttpError';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-user-register-page',
  imports: [
    Panel,
    InputText,
    Button,
    ReactiveFormsModule,
    Toast,
    ProgressSpinner,
  ],
  templateUrl: './user-register-page.component.html',
  styleUrl: './user-register-page.component.scss',
  providers: [MessageService],
})
export class UserRegisterPageComponent {
  private readonly _messageService: MessageService;
  private readonly _usersHttpService: UsersService;
  readonly userRegisterFormGroup: FormGroup;
  readonly isLoading: WritableSignal<boolean>;

  constructor(usersService: UsersService, messageService: MessageService, title: Title) {
    title.setTitle('Регистрация')
    this._usersHttpService = usersService;
    this._messageService = messageService;
    this.userRegisterFormGroup = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
      userName: new FormControl(),
    });
    this.isLoading = signal(false);
  }

  public submitRegistration(): void {
    const formValues = this.userRegisterFormGroup.value;

    const email = formValues.email ?? '';
    const password = formValues.password ?? '';
    const userName = formValues.userName ?? '';

    const registerUserDto: UserRegisterDto = {
      email: email,
      userName: userName,
      password: password,
    };

    if (!this.isEmailValid(registerUserDto)) return;
    if (!this.isUserNameValid(registerUserDto)) return;
    if (!this.isPasswordValid(registerUserDto)) return;

    this.userRegisterFormGroup.reset();
    this.isLoading.set(true);
    this._usersHttpService.registerUser(registerUserDto)
      .pipe(finalize(() => {
        this.isLoading.set(false);
      }), catchError((err) => {
        const error = CustomHttpErrorFactory.AsHttpError(err);
        MessageServiceUtils.showError(this._messageService, error.message);
        return new Observable<never>();
      }))
      .subscribe((response) => {
        if (response.code === 200 || response.code === 201) {
          MessageServiceUtils.showStickySuccess(
            this._messageService,
            'Регистрация прошла успешно.',
          );
          const message = `На почту: ${registerUserDto.email} отправлено письмо для подтверждения регистрации.`;
          MessageServiceUtils.showStickyInfo(this._messageService, message);
        }
      })
  }

  private isEmailValid(dto: UserRegisterDto): boolean {
    const email = dto.email;

    if (StringUtils.isEmptyOrWhiteSpace(email)) {
      MessageServiceUtils.showError(this._messageService, 'Почта не указана.');
      return false;
    }

    if (!StringUtils.isEmailValid(email)) {
      MessageServiceUtils.showError(
        this._messageService,
        `Почта: ${email} некорректна.`,
      );
      return false;
    }

    return true;
  }

  private isPasswordValid(dto: UserRegisterDto): boolean {
    const password = dto.password;

    if (StringUtils.isLessThan(password, 10)) {
      MessageServiceUtils.showError(
        this._messageService,
        'Пароль должен быть больше или равен 10 символам.',
      );
      return false;
    }

    if (StringUtils.isGreaterThan(password, 100)) {
      MessageServiceUtils.showError(
        this._messageService,
        'Пароль должен быть меньше 100 символов.',
      );
      return false;
    }

    return true;
  }

  private isUserNameValid(dto: UserRegisterDto): boolean {
    const userName = dto.userName;

    if (StringUtils.isEmptyOrWhiteSpace(userName)) {
      MessageServiceUtils.showError(
        this._messageService,
        'Имя пользователя было пустым.',
      );
      return false;
    }

    if (StringUtils.isGreaterThan(userName, 100)) {
      MessageServiceUtils.showError(
        this._messageService,
        'Слишком длинное имя пользователя.',
      );
      return false;
    }

    return true;
  }
}
