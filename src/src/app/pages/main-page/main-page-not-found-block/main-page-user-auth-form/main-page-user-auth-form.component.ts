import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";
import { AuthDto } from '../../../../shared/services/auth-dto';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-main-page-user-auth-form',
  imports: [Button, InputText, ReactiveFormsModule],
  templateUrl: './main-page-user-auth-form.component.html',
  styleUrl: './main-page-user-auth-form.component.scss',
})
export class MainPageUserAuthFormComponent {
  @Output() userAuthEvent: EventEmitter<AuthDto>;
  readonly userAuthFormGroup: FormGroup;

  constructor() {
    this.userAuthEvent = new EventEmitter<AuthDto>();
    this.userAuthFormGroup = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
    });
  }

  public submitAuthorization(): void {
    const formValues = this.userAuthFormGroup.value;

    const email = formValues.email ?? '';
    const password = formValues.password ?? '';

    const dto: AuthDto = { email: email, password: password };
    console.log(dto);
    this.userAuthFormGroup.reset();
    this.userAuthEvent.emit(dto);
  }
}
