import {
  Component,
  DestroyRef,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { Drawer } from 'primeng/drawer';
import { RouterLink } from '@angular/router';
import { UsersService } from '../../../../pages/sign-in-page/services/UsersService';
import { CookieService } from 'ngx-cookie-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidebar',
  imports: [ButtonModule, NgOptimizedImage, Drawer, RouterLink, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [],
})
export class SidebarComponent {
  @Output() closeClicked: EventEmitter<void> = new EventEmitter();
  @Input({ required: true }) isExpanded: boolean = false;

  public isAdminUser: WritableSignal<boolean>;
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  constructor(usersService: UsersService, cookieService: CookieService) {
    this.isAdminUser = signal(false);
    effect(() => {
      const tokenId: string | undefined = cookieService.get(
        'RemTechAccessTokenId',
      );
      if (tokenId === undefined) {
        this.isAdminUser.set(false);
        return;
      }
      usersService
        .verifyAdminAccess(tokenId)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (_): void => {
            this.isAdminUser.set(true);
          },
          error: (_): void => {
            this.isAdminUser.set(false);
          },
        });
    });
  }

  public closeClick(): void {
    this.closeClicked.emit();
  }
}
