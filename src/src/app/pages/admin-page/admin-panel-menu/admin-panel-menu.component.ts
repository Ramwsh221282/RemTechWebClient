import { Component, signal, WritableSignal } from '@angular/core';
import { AdminPanelMenuNavigationComponent } from './admin-panel-menu-navigation/admin-panel-menu-navigation.component';
import { AdminPanelParsersMenuComponent } from './admin-panel-parsers-menu/admin-panel-parsers-menu.component';
import {ScrollPanel} from 'primeng/scrollpanel';

@Component({
  selector: 'app-admin-panel-menu',
  imports: [
    AdminPanelMenuNavigationComponent,
    AdminPanelParsersMenuComponent,
    ScrollPanel,
  ],
  templateUrl: './admin-panel-menu.component.html',
  styleUrl: './admin-panel-menu.component.scss',
})
export class AdminPanelMenuComponent {
  readonly currentMenuSection: WritableSignal<string>;

  constructor() {
    this.currentMenuSection = signal('parsersManagement');
  }

  public handleMenuSelected(menuName: string): void {
    this.currentMenuSection.set(menuName);
  }
}
