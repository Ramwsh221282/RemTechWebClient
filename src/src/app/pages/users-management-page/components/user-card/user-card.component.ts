import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { ReadUserResponse } from '../../types/ReadUserResponse';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent {
  @Output() editUserClick: EventEmitter<ReadUserResponse>;
  @Output() deleteUserClick: EventEmitter<ReadUserResponse>;
  @Input({ required: true }) set user_setter(value: ReadUserResponse) {
    this._user.set(value);
  }

  private readonly _user: WritableSignal<ReadUserResponse>;

  constructor() {
    this.editUserClick = new EventEmitter<ReadUserResponse>();
    this.deleteUserClick = new EventEmitter<ReadUserResponse>();
    this._user = signal({
      emailConfirmed: false,
      name: '',
      id: '',
      email: '',
      role: '',
    });
  }

  public onEditClick(): void {
    this.editUserClick.emit(this._user());
  }

  public get name(): string {
    return this._user().name;
  }

  public get email(): string {
    return this._user().email;
  }

  public get role(): string {
    return this._user().role;
  }

  public get emailConfirmed(): boolean {
    return this._user().emailConfirmed;
  }
}
