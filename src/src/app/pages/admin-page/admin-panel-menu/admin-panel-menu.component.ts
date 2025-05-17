import { Component, signal, WritableSignal } from '@angular/core';
import { AdminPanelMenuNavigationComponent } from './admin-panel-menu-navigation/admin-panel-menu-navigation.component';
import { AdminPanelParsersMenuComponent } from './admin-panel-parsers-menu/admin-panel-parsers-menu.component';
import { ScrollPanel } from 'primeng/scrollpanel';
import { AdminPanelAnalyticsMenuComponent } from './admin-panel-analytics-menu/admin-panel-analytics-menu.component';
import { AdminPanelMailingServiceMenuComponent } from './admin-panel-mailing-service-menu/admin-panel-mailing-service-menu.component';

@Component({
  selector: 'app-admin-panel-menu',
  imports: [
    AdminPanelMenuNavigationComponent,
    AdminPanelParsersMenuComponent,
    ScrollPanel,
    AdminPanelAnalyticsMenuComponent,
    AdminPanelMailingServiceMenuComponent,
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
