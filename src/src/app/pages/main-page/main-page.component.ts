import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MainPageHeadComponent } from './main-page-head/main-page-head.component';
import { MainPageCategoriesBlockComponent } from './main-page-categories-block/main-page-categories-block.component';
import { ScrollPanel } from 'primeng/scrollpanel';
import { MainPageNotFoundBlockComponent } from './main-page-not-found-block/main-page-not-found-block.component';
import { MainPageAdvantagesBlockComponent } from './main-page-advantages-block/main-page-advantages-block.component';
import { AdvertisementsHttpService } from '../transport-catalogue-page/services/advertisements-http.service';
import { StatisticalCategory } from '../admin-page/admin-panel-menu/admin-panel-analytics-menu/types/statistical-category';
import { MainPageAnalyticsBlockComponent } from './main-page-analytics-block/main-page-analytics-block.component';

@Component({
  selector: 'app-main-page',
  imports: [
    MainPageHeadComponent,
    MainPageCategoriesBlockComponent,
    ScrollPanel,
    MainPageNotFoundBlockComponent,
    MainPageAdvantagesBlockComponent,
    MainPageAnalyticsBlockComponent,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent implements OnInit {
  private readonly advertisementsHttpService: AdvertisementsHttpService;
  readonly statisticalCategories: WritableSignal<StatisticalCategory[]>;

  constructor(advertisementsHttpService: AdvertisementsHttpService) {
    this.advertisementsHttpService = advertisementsHttpService;
    this.statisticalCategories = signal([]);
  }

  public ngOnInit(): void {
    this.advertisementsHttpService
      .getStatisticalData()
      .subscribe((response) => {
        if (response.code === 200) {
          const data: StatisticalCategory[] = response.data;
          this.statisticalCategories.set(data);
        }
      });
  }
}
