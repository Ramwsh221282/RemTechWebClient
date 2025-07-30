import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SideBarButtonComponent } from './side-bar-button/side-bar-button.component';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { Drawer } from 'primeng/drawer';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    ButtonModule,
    SideBarButtonComponent,
    NgOptimizedImage,
    Drawer,
    RouterLink,
    NgIf,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [],
})
export class SidebarComponent {
  @Output() closeClicked: EventEmitter<void> = new EventEmitter();
  @Input({ required: true }) isExpanded: boolean = false;

  public closeClick(): void {
    this.closeClicked.emit();
  }
}
