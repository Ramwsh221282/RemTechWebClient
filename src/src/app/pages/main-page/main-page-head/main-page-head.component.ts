import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { Panel } from 'primeng/panel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { MainPageHeadImagesComponent } from './main-page-head-images/main-page-head-images.component';
import { MainPageHeadSearchComponent } from './main-page-head-search/main-page-head-search.component';
import { MainPageHeadOverlayComponent } from './main-page-head-overlay/main-page-head-overlay.component';

@Component({
  selector: 'app-main-page-head',
  imports: [
    MainPageHeadImagesComponent,
    MainPageHeadSearchComponent,
    MainPageHeadOverlayComponent,
  ],
  templateUrl: './main-page-head.component.html',
  styleUrl: './main-page-head.component.scss',
})
export class MainPageHeadComponent {}
