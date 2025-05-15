import {
  Component,
  computed,
  Input,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  StatisticalCategory,
  StatisticalCategoryBrand,
  StatisticalTransportModel,
} from '../../admin-page/admin-panel-menu/admin-panel-analytics-menu/types/statistical-category';
import { MainPageCategoryAnalyticsComponent } from './main-page-category-analytics/main-page-category-analytics.component';
import { MainPageBrandsAnalyticsComponent } from './main-page-brands-analytics/main-page-brands-analytics.component';
import { MainPageTransportModelsAnalyticsComponent } from './main-page-transport-models-analytics/main-page-transport-models-analytics.component';
import { Panel } from 'primeng/panel';

@Component({
  selector: 'app-main-page-analytics-block',
  imports: [
    MainPageCategoryAnalyticsComponent,
    MainPageBrandsAnalyticsComponent,
    MainPageTransportModelsAnalyticsComponent,
    Panel,
  ],
  templateUrl: './main-page-analytics-block.component.html',
  styleUrl: './main-page-analytics-block.component.scss',
})
export class MainPageAnalyticsBlockComponent {
  @Input({ required: true, alias: 'categories' }) set _categories(
    categories: StatisticalCategory[],
  ) {
    const categoryWithMostBrands =
      categories.length === 0
        ? null
        : categories.reduce((prev, current) => {
            return prev.brands.length > current.brands.length ? prev : current;
          });

    const brands =
      categoryWithMostBrands === null ? [] : categoryWithMostBrands.brands;

    const brandWithMostModels =
      brands.length === 0
        ? null
        : brands.reduce((prev, current) => {
            return prev.transportModels.length > current.transportModels.length
              ? prev
              : current;
          });

    const models =
      brandWithMostModels === null ? [] : brandWithMostModels.transportModels;

    this.brands.set(brands);
    this.models.set(models);
    this.categories.set(categories);

    this.currentCategory.set(categoryWithMostBrands);
    this.currentBrand.set(brandWithMostModels);
  }

  readonly categories: WritableSignal<StatisticalCategory[]>;
  readonly brands: WritableSignal<StatisticalCategoryBrand[]>;
  readonly models: WritableSignal<StatisticalTransportModel[]>;
  readonly currentCategory: WritableSignal<StatisticalCategory | null>;
  readonly currentBrand: WritableSignal<StatisticalCategoryBrand | null>;

  readonly currentCategoryHeader = computed(() => {
    const category = this.currentCategory();
    if (!category) return '';
    return `БРЕНДЫ ${category.name}`;
  });

  readonly currentBrandHeader = computed(() => {
    const brand = this.currentBrand();
    if (!brand) return '';
    return `МОДЕЛИ ${brand.brandName}`;
  });

  constructor() {
    this.categories = signal([]);
    this.brands = signal([]);
    this.models = signal([]);
    this.currentCategory = signal(null);
    this.currentBrand = signal(null);
  }

  public acceptSelectedCategory(categoryName: string) {
    const categories = this.categories();
    const categoryIndex = categories.findIndex(
      (cat) => cat.name === categoryName,
    );
    if (categoryIndex >= 0) {
      const selectedCategory = categories[categoryIndex];
      this.currentCategory.set(selectedCategory);
      this.brands.set(selectedCategory.brands);
      this.models.set(selectedCategory.brands[0].transportModels);
    }
  }

  public acceptSelectedBrand(brandName: string) {
    const brands = this.brands();
    const brandIndex = brands.findIndex((br) => br.brandName === brandName);
    if (brandIndex >= 0) {
      const selectedBrand = brands[brandIndex];
      this.currentBrand.set(selectedBrand);
      this.models.set(selectedBrand.transportModels);
    }
  }
}
