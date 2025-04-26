import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SideBarButtonComponent } from './side-bar-button/side-bar-button.component';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [ButtonModule, SideBarButtonComponent, NgOptimizedImage],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [],
})
export class SidebarComponent {
  @Input({ required: true }) isExpanded: boolean = false;
}
