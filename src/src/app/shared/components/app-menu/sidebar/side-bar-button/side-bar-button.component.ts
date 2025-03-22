import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AnimationsFactory } from '../../../../animations/animations-factory';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-bar-button',
  imports: [ButtonModule, NgClass, NgIf, RouterLink],
  templateUrl: './side-bar-button.component.html',
  styleUrl: './side-bar-button.component.scss',
  animations: [
    AnimationsFactory.expandCollapseAnimation('width', '100%', '25px'),
  ],
})
export class SideBarButtonComponent {
  @Input({ required: true }) label: string = '';
  @Input({ required: true }) icon: string = '';
  @Input({ required: true }) isLabelShown: boolean = false;
  @Input({ required: true }) navigationRoute: string = '';
}
