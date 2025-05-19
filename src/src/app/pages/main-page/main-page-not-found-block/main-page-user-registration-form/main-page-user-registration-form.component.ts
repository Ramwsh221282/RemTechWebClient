import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserRegisterDto } from '../../../../shared/services/user-register-dto';

@Component({
  selector: 'app-main-page-user-registration-form',
  imports: [Button, InputText, ReactiveFormsModule],
  templateUrl: './main-page-user-registration-form.component.html',
  styleUrl: './main-page-user-registration-form.component.scss',
})
export class MainPageUserRegistrationFormComponent {
  @Output() userRegisteredEvent: EventEmitter<UserRegisterDto>;
  readonly userRegisterFormGroup: FormGroup;

  constructor() {
    this.userRegisteredEvent = new EventEmitter<UserRegisterDto>();
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

    const registerUserDto: UserRegisterDto = { email: email, userName: userName, password: password };

    this.userRegisterFormGroup.reset();
    this.userRegisteredEvent.emit(registerUserDto);
  }
}
