import { Component } from '@angular/core';
import { ScrollPanel } from 'primeng/scrollpanel';
import { Panel } from 'primeng/panel';
import { MainPageCategoriesCarouselComponent } from './main-page-categories-carousel/main-page-categories-carousel.component';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-main-page-categories-block',
  imports: [ScrollPanel, Panel, MainPageCategoriesCarouselComponent, Button],
  templateUrl: './main-page-categories-block.component.html',
  styleUrl: './main-page-categories-block.component.scss',
})
export class MainPageCategoriesBlockComponent {}
