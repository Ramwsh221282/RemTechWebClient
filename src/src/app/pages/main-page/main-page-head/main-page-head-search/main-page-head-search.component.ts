import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { Panel } from 'primeng/panel';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-main-page-head-search',
  imports: [Button, Panel, Select],
  templateUrl: './main-page-head-search.component.html',
  styleUrl: './main-page-head-search.component.scss',
})
export class MainPageHeadSearchComponent {}
