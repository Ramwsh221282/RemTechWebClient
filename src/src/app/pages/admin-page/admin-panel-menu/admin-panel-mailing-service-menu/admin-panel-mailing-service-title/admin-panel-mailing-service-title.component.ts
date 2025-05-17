import { Component, EventEmitter, Output } from '@angular/core';
import { Panel } from 'primeng/panel';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-admin-panel-mailing-service-title',
  imports: [Panel, NgOptimizedImage],
  templateUrl: './admin-panel-mailing-service-title.component.html',
  styleUrl: './admin-panel-mailing-service-title.component.scss',
})
export class AdminPanelMailingServiceTitleComponent {
  @Output() openGoogleInstructions: EventEmitter<void> = new EventEmitter();
  @Output() openMailRuInstructions: EventEmitter<void> = new EventEmitter();
  @Output() openYandexInstructions: EventEmitter<void> = new EventEmitter();
}
