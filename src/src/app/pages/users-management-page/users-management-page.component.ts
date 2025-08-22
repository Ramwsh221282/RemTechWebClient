import {
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import { ReadUserResponse } from './types/ReadUserResponse';
import { UsersService } from '../sign-in-page/services/UsersService';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EmailFilterInputComponent } from './components/email-filter-input/email-filter-input.component';
import { NameFilterInputComponent } from './components/name-filter-input/name-filter-input.component';
import { RoleFilterSelectComponent } from './components/role-filter-select/role-filter-select.component';
import { ReadRoleResponse } from './types/ReadRoleResponse';
import { AddUserDialogComponent } from './components/add-user-dialog/add-user-dialog.component';

@Component({
  selector: 'app-users-management-page',
  imports: [
    EmailFilterInputComponent,
    NameFilterInputComponent,
    RoleFilterSelectComponent,
    AddUserDialogComponent,
  ],
  templateUrl: './users-management-page.component.html',
  styleUrl: './users-management-page.component.scss',
})
export class UsersManagementPageComponent {
  public readonly _nameFilter: WritableSignal<string | null>;
  public readonly _roleFilter: WritableSignal<ReadRoleResponse | null>;
  public readonly _emailFilter: WritableSignal<string | null>;
  private readonly _page: WritableSignal<number>;
  private readonly _isAddingUser: WritableSignal<boolean>;
  private readonly _availableRoles: WritableSignal<ReadRoleResponse[]>;
  public readonly _users: WritableSignal<ReadUserResponse[]>;
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  constructor(service: UsersService) {
    this._availableRoles = signal([]);
    this._isAddingUser = signal(false);
    this._nameFilter = signal(null);
    this._roleFilter = signal(null);
    this._emailFilter = signal(null);
    this._page = signal(1);
    this._users = signal([]);
    effect(() => {
      const page: number = this._page();
      const nameFilter: string | null = this._nameFilter();
      const roleFilter: ReadRoleResponse | null = this._roleFilter();
      const emailFilter: string | null = this._emailFilter();
      service
        .readUsers(
          page,
          nameFilter,
          emailFilter,
          roleFilter ? roleFilter.name : null,
        )
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (users: ReadUserResponse[]): void => {
            this._users.set(users);
          },
        });
    });
  }

  public acceptRoles(roles: ReadRoleResponse[]): void {
    this._availableRoles.set(roles);
  }

  public get availableRoles(): ReadRoleResponse[] {
    return this._availableRoles();
  }

  public handleAddUserClick(): void {
    this._isAddingUser.set(true);
  }

  public handleAddUserFormClose(): void {
    this._isAddingUser.set(false);
  }

  public get isAddingUser(): boolean {
    return this._isAddingUser();
  }

  public get currentEmailFilter(): string | null {
    return this._emailFilter();
  }

  public get currentNameFilter(): string | null {
    return this._nameFilter();
  }

  public get currentRoleFilter(): ReadRoleResponse | null {
    return this._roleFilter();
  }

  public changeNameFilter(name: string | null): void {
    this._nameFilter.set(name);
  }

  public changeEmailFilter(name: string | null): void {
    this._emailFilter.set(name);
  }

  public changeRoleFilter(role: ReadRoleResponse | null): void {
    this._roleFilter.set(role);
  }

  public changePage(page: number): void {
    this._page.set(page);
  }
}
