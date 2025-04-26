import { Component, signal, WritableSignal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AdminPanelMenuComponent } from './admin-panel-menu/admin-panel-menu.component';

@Component({
  selector: 'app-admin-page',
  imports: [AdminPanelMenuComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
})
export class AdminPageComponent {
  private readonly _menuNames: string[] = ['parserManagement'];
  readonly currentMenu: WritableSignal<string> = signal(this._menuNames[0]);

  public constructor(titleService: Title) {
    titleService.setTitle('Администрирование');
  }

  public handleMenuChanged($newMenu: string) {
    this.currentMenu.set($newMenu);
  }
}
