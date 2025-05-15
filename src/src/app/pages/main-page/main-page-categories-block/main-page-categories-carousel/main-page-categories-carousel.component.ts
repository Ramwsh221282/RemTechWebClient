import { Component, Input, signal, WritableSignal } from '@angular/core';
import { Carousel } from 'primeng/carousel';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { StatisticalCategory } from '../../../admin-page/admin-panel-menu/admin-panel-analytics-menu/types/statistical-category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page-categories-carousel',
  imports: [Carousel, Card, Button],
  templateUrl: './main-page-categories-carousel.component.html',
  styleUrl: './main-page-categories-carousel.component.scss',
})
export class MainPageCategoriesCarouselComponent {
  @Input({ required: true, alias: 'categories' }) set _categories(
    value: StatisticalCategory[],
  ) {
    this.categoriesSignal.set(value);
  }

  private readonly _router: Router;

  readonly categoriesSignal: WritableSignal<StatisticalCategory[]>;

  constructor(router: Router) {
    this.categoriesSignal = signal([]);
    this._router = router;
  }

  public navigateCategoryBrand(category: StatisticalCategory): void {
    const id = category.id;
    const urlPath = `transport-catalogue/categories/${id}/brands`;

    this._router.navigate([urlPath]);
  }
}
