import { Component, Input, signal, WritableSignal } from '@angular/core';
import { Panel } from 'primeng/panel';
import { MainPageCategoriesCarouselComponent } from './main-page-categories-carousel/main-page-categories-carousel.component';
import { StatisticalCategory } from '../../admin-page/admin-panel-menu/admin-panel-analytics-menu/types/statistical-category';
import { AdvertisementsHttpService } from '../../transport-catalogue-page/services/advertisements-http.service';

@Component({
  selector: 'app-main-page-categories-block',
  imports: [Panel, MainPageCategoriesCarouselComponent],
  templateUrl: './main-page-categories-block.component.html',
  styleUrl: './main-page-categories-block.component.scss',
  providers: [AdvertisementsHttpService],
})
export class MainPageCategoriesBlockComponent {
  @Input({ required: true, alias: 'categories' })
  set _categories(value: StatisticalCategory[]) {
    this.categories.set(value);
  }

  readonly categories: WritableSignal<StatisticalCategory[]> = signal([]);
}
