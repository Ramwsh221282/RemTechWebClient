import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MainPageHeadComponent } from './main-page-head/main-page-head.component';
import { MainPageCategoriesBlockComponent } from './main-page-categories-block/main-page-categories-block.component';
import { ScrollPanel } from 'primeng/scrollpanel';
import { MainPageNotFoundBlockComponent } from './main-page-not-found-block/main-page-not-found-block.component';
import { MainPageAdvantagesBlockComponent } from './main-page-advantages-block/main-page-advantages-block.component';

@Component({
  selector: 'app-main-page',
  imports: [
    PageHeaderComponent,
    MainPageHeadComponent,
    MainPageCategoriesBlockComponent,
    ScrollPanel,
    MainPageNotFoundBlockComponent,
    MainPageAdvantagesBlockComponent,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent {}
