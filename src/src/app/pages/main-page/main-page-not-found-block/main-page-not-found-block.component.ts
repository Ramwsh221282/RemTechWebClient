import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { Panel } from 'primeng/panel';
import { NgOptimizedImage } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { UserRegisterDto } from '../../../shared/services/user-register-dto';
import { FormControl, FormGroup } from '@angular/forms';
import { ProgressSpinner } from 'primeng/progressspinner';
import {
  MainPageUserRegistrationFormComponent
} from './main-page-user-registration-form/main-page-user-registration-form.component';
import { MainPageUserAuthFormComponent } from './main-page-user-auth-form/main-page-user-auth-form.component';

@Component({
  selector: 'app-main-page-not-found-block',
  imports: [
    Panel,
    NgOptimizedImage,
    InputText,
    Button,
    ProgressSpinner,
    MainPageUserRegistrationFormComponent,
    MainPageUserAuthFormComponent,
  ],
  templateUrl: './main-page-not-found-block.component.html',
  styleUrl: './main-page-not-found-block.component.scss',
})
export class MainPageNotFoundBlockComponent {
  @Output() userRegisteredEvent: EventEmitter<UserRegisterDto>;
  @Input({ required: true, alias: 'isAuthLoading' }) set _isAuthLoading(
    isAuthLoading: boolean,
  ) {
    this.isAuthLoading.set(isAuthLoading);
  }

  readonly isAuthLoading: WritableSignal<boolean>;
  readonly userRegisterFormGroup: FormGroup;

  constructor() {
    this.userRegisteredEvent = new EventEmitter<UserRegisterDto>();
    this.isAuthLoading = signal(false);
    this.userRegisterFormGroup = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
      userName: new FormControl(),
    });
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

    this.userRegisterFormGroup.reset();
    this.userRegisteredEvent.emit(registerUserDto);
  }
}
