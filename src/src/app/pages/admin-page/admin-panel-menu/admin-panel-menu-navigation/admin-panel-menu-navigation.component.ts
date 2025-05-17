import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Button } from 'primeng/button';
import { Panel } from 'primeng/panel';

interface AdminPanelMenuButtonProperties {
  label: string;
  name: string;
  isDisabled: boolean;
}

@Component({
  selector: 'app-admin-panel-menu-navigation',
  imports: [Button, Panel],
  templateUrl: './admin-panel-menu-navigation.component.html',
  styleUrl: './admin-panel-menu-navigation.component.scss',
})
export class AdminPanelMenuNavigationComponent implements OnInit {
  @Output() menuSelected: EventEmitter<string>;
  readonly menuButtons: AdminPanelMenuButtonProperties[];

  constructor() {
    this.menuButtons = [];
    this.menuSelected = new EventEmitter();
  }

  public ngOnInit(): void {
    this.addMenuButton('Управление парсерами', 'parsersManagement', false);
    this.addMenuButton('Визуализация', 'analytics', false);
    this.addMenuButton(
      'Управление почтой сервиса',
      'mailSenderManagement',
      false,
    );
    this.addMenuButton(
      'Регистрация администраторов (WIP)',
      'adminsManagement',
      true,
    );
    this.addMenuButton(
      'Управление синхронизатором объявлений (WIP)',
      'parserSynchronizator',
      true,
    );
  }

  public handleMenuButtonClick(
    $event: MouseEvent,
    button: AdminPanelMenuButtonProperties,
  ): void {
    $event.stopPropagation();
    this.menuSelected.emit(button.name);
  }

  private addMenuButton(
    label: string,
    name: string,
    isDisabled: boolean,
  ): void {
    const button: AdminPanelMenuButtonProperties = {
      label: label,
      name: name,
      isDisabled: isDisabled,
    };
    this.menuButtons.push(button);
  }
}
