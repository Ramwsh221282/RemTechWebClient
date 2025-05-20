import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { Panel } from 'primeng/panel';
import { NgOptimizedImage } from '@angular/common';
import { UserRegisterDto } from '../../../shared/services/user-register-dto';
import { FormControl, FormGroup } from '@angular/forms';
import { ProgressSpinner } from 'primeng/progressspinner';
import {
  MainPageUserRegistrationFormComponent
} from './main-page-user-registration-form/main-page-user-registration-form.component';
import { MainPageUserAuthFormComponent } from './main-page-user-auth-form/main-page-user-auth-form.component';
import { AuthDto } from '../../../shared/services/auth-dto';
import { MainPageUserAuthorizedComponent } from './main-page-user-authorized/main-page-user-authorized.component';

@Component({
  selector: 'app-main-page-not-found-block',
  imports: [
    Panel,
    NgOptimizedImage,
    ProgressSpinner,
    MainPageUserRegistrationFormComponent,
    MainPageUserAuthFormComponent,
    MainPageUserAuthorizedComponent,
  ],
  templateUrl: './main-page-not-found-block.component.html',
  styleUrl: './main-page-not-found-block.component.scss',
})
export class MainPageNotFoundBlockComponent {
  @Output() userRegisteredEvent: EventEmitter<UserRegisterDto>;
  @Output() userAuthEvent: EventEmitter<AuthDto>;
  @Input({ required: true, alias: 'isAuthLoading' }) set _isAuthLoading(
    isAuthLoading: boolean,
  ) {
    this.isAuthLoading.set(isAuthLoading);
  }
  @Input({ required: true, alias: 'isAuthorized' }) set _isAuthorized(
    value: boolean,
  ) {
    this.isAuthorizedSignal.set(value);
  }

  readonly isAuthLoading: WritableSignal<boolean>;
  readonly isAuthorizedSignal: WritableSignal<boolean>;
  readonly userRegisterFormGroup: FormGroup;

  constructor() {
    this.userRegisteredEvent = new EventEmitter<UserRegisterDto>();
    this.userAuthEvent = new EventEmitter<AuthDto>();
    this.isAuthLoading = signal(false);
    this.isAuthorizedSignal = signal(false);
    this.userRegisterFormGroup = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
      userName: new FormControl(),
    });
  }
}
