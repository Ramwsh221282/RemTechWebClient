import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AppMenuService } from '../app-menu.service';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthStatusService } from '../../../services/auth-status.service';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, NgOptimizedImage, RouterLink, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly _appMenuService: AppMenuService;
  private readonly _authStatusService: AuthStatusService;

  constructor(
    appMenuService: AppMenuService,
    authStatusService: AuthStatusService,
  ) {
    this._appMenuService = appMenuService;
    this._authStatusService = authStatusService;
  }

  public onMenuButtonClick = (event: MouseEvent) => {
    event.stopPropagation();
    this._appMenuService.turnSideBarVisibility();
  };

  public get isAuthorized(): boolean {
    return this._authStatusService.isUserLoggedIn();
  }
}
