import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Panel } from 'primeng/panel';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { UsersService } from '../../shared/services/users.service';
import { StringUtils } from '../../shared/utils/string-utils';
import { UserConfirmEmailDto } from '../../shared/services/user-confirm-email-dto';
import { catchError, finalize, Observable } from 'rxjs';
import { CustomHttpErrorFactory } from '../../shared/types/CustomHttpError';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-registration-confirmation-page',
  imports: [Panel, Button, RouterLink, ProgressSpinner],
  templateUrl: './registration-confirmation-page.component.html',
  styleUrl: './registration-confirmation-page.component.scss',
})
export class RegistrationConfirmationPageComponent implements OnInit {
  private readonly _usersHttpService: UsersService;
  private readonly _route: ActivatedRoute;
  readonly isLoadingSignal: WritableSignal<boolean>;
  readonly isSuccessSignal: WritableSignal<boolean>;
  readonly errorMessageSignal: WritableSignal<string>;
  readonly statusSignal: WritableSignal<string>;

  constructor(route: ActivatedRoute, usersHttpService: UsersService, title: Title) {
    this._route = route;
    this._usersHttpService = usersHttpService;
    this.isLoadingSignal = signal(false);
    this.isSuccessSignal = signal(false);
    this.errorMessageSignal = signal('');
    this.statusSignal = signal('');
    title.setTitle('Подтверждение почты')
  }

  public ngOnInit() {
    this._route.queryParams.subscribe((params) => {
      const userId = params['userid'];
      const token = params['token'];
      this.processConfirmation(userId, token);
    });
  }

  private processConfirmation(userId: string, token: string): void {
    if (!this.isTokenValid(token)) return;
    if (!this.isUserIdValid(userId)) return;

    const dto: UserConfirmEmailDto = { userId: userId, token: token };

    this.isLoadingSignal.set(true);
    this.statusSignal.set('Подтверждение почты...');

    this._usersHttpService.confirmEmail(dto)
      .pipe(finalize(() => {
        this.isLoadingSignal.set(false);
      }), catchError((err: any) => {
        const error = CustomHttpErrorFactory.AsHttpError(err);
        this.statusSignal.set('Ошибка.');
        if (error.code === 404) {
          this.errorMessageSignal.set('Пользователь не найден.');
          return new Observable<never>();
        }
        this.errorMessageSignal.set(error.message);
        return new Observable<never>();
      }))
      .subscribe((response) => {
        if (response.code === 200) {
          this.statusSignal.set('Почта подтверждена.');
          this.isSuccessSignal.set(true);
        }
      })
  }

  private isTokenValid(token: string): boolean {
    if (StringUtils.isEmptyOrWhiteSpace(token)) {
      this.errorMessageSignal.set('Некорректный токен подтверждения.')
      return false;
    }
    return true;
  }

  private isUserIdValid(userId: string): boolean {
    if (StringUtils.isEmptyOrWhiteSpace(userId)) {
      this.errorMessageSignal.set('Некорректный идентификатор пользователя.')
      return false;
    }
    return true;
  }
}
