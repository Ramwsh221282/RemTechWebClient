import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { MainPageHeadComponent } from './main-page-head/main-page-head.component';
import { MainPageCategoriesBlockComponent } from './main-page-categories-block/main-page-categories-block.component';
import { ScrollPanel } from 'primeng/scrollpanel';
import { MainPageNotFoundBlockComponent } from './main-page-not-found-block/main-page-not-found-block.component';
import { MainPageAdvantagesBlockComponent } from './main-page-advantages-block/main-page-advantages-block.component';
import { AdvertisementsHttpService } from '../transport-catalogue-page/services/advertisements-http.service';
import { StatisticalCategory } from '../admin-page/admin-panel-menu/admin-panel-analytics-menu/types/statistical-category';
import { MainPageAnalyticsBlockComponent } from './main-page-analytics-block/main-page-analytics-block.component';
import { MessageService } from 'primeng/api';
import { UsersService } from '../../shared/services/users.service';
import { UserRegisterDto } from '../../shared/services/user-register-dto';
import { StringUtils } from '../../shared/utils/string-utils';
import { MessageServiceUtils } from '../../shared/utils/message-service-utils';
import { catchError, finalize, Observable } from 'rxjs';
import { CustomHttpErrorFactory } from '../../shared/types/CustomHttpError';
import { Toast } from 'primeng/toast';
import { Title } from '@angular/platform-browser';
import { AuthDto } from '../../shared/services/auth-dto';

@Component({
  selector: 'app-main-page',
  imports: [
    MainPageHeadComponent,
    MainPageCategoriesBlockComponent,
    ScrollPanel,
    MainPageNotFoundBlockComponent,
    MainPageAdvantagesBlockComponent,
    MainPageAnalyticsBlockComponent,
    Toast,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
  providers: [MessageService],
})
export class MainPageComponent implements OnInit {
  private readonly _messageService: MessageService;
  private readonly _advertisementsHttpService: AdvertisementsHttpService;
  private readonly _usersService: UsersService;
  readonly statisticalCategories: WritableSignal<StatisticalCategory[]>;
  readonly isAuthLoadingSignal: WritableSignal<boolean>;
  readonly isAuthorizedSignal: WritableSignal<boolean>;

  constructor(
    advertisementsHttpService: AdvertisementsHttpService,
    messageService: MessageService,
    usersService: UsersService,
    title: Title,
  ) {
    title.setTitle('Агрегатор лесозаготовительной спец. техники')
    this._messageService = messageService;
    this._usersService = usersService;
    this._advertisementsHttpService = advertisementsHttpService;
    this.statisticalCategories = signal([]);
    this.isAuthLoadingSignal = signal(false);
    this.isAuthorizedSignal = signal(false);
  }

  public ngOnInit(): void {
    this._advertisementsHttpService
      .getStatisticalData()
      .subscribe((response) => {
        if (response.code === 200) {
          const data: StatisticalCategory[] = response.data;
          this.statisticalCategories.set(data);
        }
      });
  }

  public acceptUserRegistration($event: UserRegisterDto): void {
    if (!this.isEmailValid($event)) return;
    if (!this.isPasswordValid($event)) return;
    if (!this.isUserNameValid($event)) return;

    this.isAuthLoadingSignal.set(true);

    this._usersService
      .registerUser($event)
      .pipe(
        finalize(() => {
          this.isAuthLoadingSignal.set(false);
        }),
        catchError((err: any) => {
          const error = CustomHttpErrorFactory.AsHttpError(err);
          MessageServiceUtils.showError(this._messageService, error.message);
          return new Observable<never>();
        }),
      )
      .subscribe((response) => {
        if (response.code == 200 || response.code == 201) {
          MessageServiceUtils.showStickySuccess(
            this._messageService,
            'Регистрация прошла успешно.',
          );
          const message = `На почту: ${$event.email} отправлено письмо для подтверждения регистрации.`;
          MessageServiceUtils.showStickyInfo(this._messageService, message);
        }
      });
  }

  public acceptUserAuthorization($event: AuthDto): void {
    this.isAuthLoadingSignal.set(true);

    this._usersService.auth($event)
      .pipe(finalize(() => {
        this.isAuthLoadingSignal.set(false);
      }), catchError((err) => {
        const error = CustomHttpErrorFactory.AsHttpError(err);
        MessageServiceUtils.showError(this._messageService, error.message);
        return new Observable<never>();
      })).subscribe((response) => {
        if (response.code === 200) {
          const message = 'Авторизация прошла успешно.';
          MessageServiceUtils.showStickySuccess(this._messageService, message);
          this.isAuthorizedSignal.set(true);
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
