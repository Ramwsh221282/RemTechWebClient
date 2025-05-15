import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { Panel } from 'primeng/panel';
import { Select } from 'primeng/select';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-page-head-overlay',
  imports: [Button, RouterLink],
  templateUrl: './main-page-head-overlay.component.html',
  styleUrl: './main-page-head-overlay.component.scss',
})
export class MainPageHeadOverlayComponent {}
