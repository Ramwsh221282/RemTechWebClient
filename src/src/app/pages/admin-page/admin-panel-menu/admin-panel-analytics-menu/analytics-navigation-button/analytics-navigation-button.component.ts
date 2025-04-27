import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-analytics-navigation-button',
  imports: [Button],
  templateUrl: './analytics-navigation-button.component.html',
  styleUrl: './analytics-navigation-button.component.scss',
})
export class AnalyticsNavigationButtonComponent {
  @Output() removeClicked: EventEmitter<void>;
  @Input({ required: true }) label: string;

  constructor() {
    this.removeClicked = new EventEmitter<void>();
    this.label = '';
  }

  public onRemoveClick($event: MouseEvent): void {
    $event.preventDefault();
    this.removeClicked.emit();
  }
}
