import { AppMenuService } from './shared/components/app-menu/app-menu.service';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from './shared/components/app-menu/header/header.component';
import { SidebarComponent } from './shared/components/app-menu/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { AnimationsFactory } from './shared/animations/animations-factory';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, HeaderComponent, SidebarComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    AnimationsFactory.expandCollapseAnimation(
      'grid-template-columns',
      '300px 1fr',
      '85px 1fr'
    ),
  ],
})
export class AppComponent {
  private readonly _appMenuService: AppMenuService;

  public constructor(AppMenuService: AppMenuService) {
    this._appMenuService = AppMenuService;
  }

  public get isSideBarVisible(): boolean {
    return this._appMenuService.isSideBarVisible;
  }

  public onAnimationStart(event: any) {
    if (event.toState === 'collapse') {
      return;
    }
  }
}
