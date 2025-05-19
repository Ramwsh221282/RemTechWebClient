import { Component, Input } from '@angular/core';
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";

@Component({
  selector: 'app-main-page-user-auth-form',
  imports: [Button, InputText],
  templateUrl: './main-page-user-auth-form.component.html',
  styleUrl: './main-page-user-auth-form.component.scss',
})
export class MainPageUserAuthFormComponent {
}
