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
import { defer, Observable } from 'rxjs';
import { TokensService } from '../../../services/TokensService';

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

  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  constructor(
    public readonly usersService: UsersService,
    public readonly tokensService: TokensService,
    private readonly cookieService: CookieService,
  ) {
    effect(() => {
      defer(() => this.waitForToken())
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (): void => {
            tokensService.setAdmin();
          },
          error: (): void => {
            tokensService.setNotAdmin();
          },
        });
    });
  }

  private waitForToken(): Observable<any> {
    return new Observable((observer) => {
      const checkToken = () => {
        const tokenId = this.cookieService.get('RemTechAccessTokenId');
        if (tokenId) {
          this.usersService.verifyAdminAccess(tokenId).subscribe({
            next: (result) => observer.next(result),
            error: (error) => observer.error(error),
          });
        } else {
          // Повторяем проверку через 100ms
          setTimeout(checkToken, 100);
        }
      };
      checkToken();
    });
  }

  public closeClick(): void {
    this.closeClicked.emit();
  }
}
