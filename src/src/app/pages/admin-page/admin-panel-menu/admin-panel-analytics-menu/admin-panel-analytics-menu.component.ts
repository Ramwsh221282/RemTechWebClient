import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { AdvertisementsHttpService } from '../../../transport-catalogue-page/services/advertisements-http.service';
import { StatisticalCategoryChartComponent } from './category-charts/statistical-category-chart/statistical-category-chart.component';
import {
  StatisticalCategory,
  StatisticalCategoryBrand,
  StatisticalCategoryBrandGeo,
  StatisticalTransportModel,
} from './types/statistical-category';
import { Panel } from 'primeng/panel';
import { NgIf } from '@angular/common';
import { BrandChartsComponent } from './brand-charts/brand-charts.component';
import { BrandGeoChartsComponent } from './brand-geo-charts/brand-geo-charts.component';
import { BrandTransportModelsChartsComponent } from './brand-transport-models-charts/brand-transport-models-charts.component';
import { AnalyticsNavigationButtonComponent } from './analytics-navigation-button/analytics-navigation-button.component';
import { Divider } from 'primeng/divider';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-panel-analytics-menu',
  imports: [
    StatisticalCategoryChartComponent,
    Panel,
    NgIf,
    BrandChartsComponent,
    BrandGeoChartsComponent,
    BrandTransportModelsChartsComponent,
    AnalyticsNavigationButtonComponent,
    Divider,
  ],
  templateUrl: './admin-panel-analytics-menu.component.html',
  styleUrl: './admin-panel-analytics-menu.component.scss',
})
export class AdminPanelAnalyticsMenuComponent implements OnInit {
  private readonly _httpService: AdvertisementsHttpService;
  readonly categoriesSignal: WritableSignal<StatisticalCategory[]>;
  readonly brandsOfSelectedCategorySignal: WritableSignal<
    StatisticalCategoryBrand[]
  >;
  readonly geoOfSelectedCategoryBrandSignal: WritableSignal<
    StatisticalCategoryBrandGeo[]
  >;
  readonly selectedCategorySignal: WritableSignal<StatisticalCategory | null>;
  readonly selectedCategoryBrandSignal: WritableSignal<StatisticalCategoryBrand | null>;
  readonly transportModelsOfSelectedCategoryBrandSignal: WritableSignal<
    StatisticalTransportModel[]
  >;

  constructor(httpService: AdvertisementsHttpService, title: Title) {
    title.setTitle('Администрирование. Аналитика')
    this._httpService = httpService;
    this.categoriesSignal = signal([]);
    this.brandsOfSelectedCategorySignal = signal([]);
    this.geoOfSelectedCategoryBrandSignal = signal([]);
    this.selectedCategorySignal = signal(null);
    this.selectedCategoryBrandSignal = signal(null);
    this.transportModelsOfSelectedCategoryBrandSignal = signal([]);
  }

  public ngOnInit() {
    this._httpService.getStatisticalData().subscribe((result) => {
      if (result.code === 200) {
        this.categoriesSignal.set(result.data);
      }
    });
  }

  public handleCategoryNameSelected(categoryName: string): void {
    const categories: StatisticalCategory[] = this.categoriesSignal();
    const indexOfSelectedCategory = categories.findIndex(
      (c) => c.name === categoryName,
    );
    if (indexOfSelectedCategory < 0) return;
    const selectedCategory: StatisticalCategory =
      categories[indexOfSelectedCategory];
    this.selectedCategorySignal.set(selectedCategory);
    const brandsOfSelectedCategory: StatisticalCategoryBrand[] =
      selectedCategory.brands;
    this.brandsOfSelectedCategorySignal.set(brandsOfSelectedCategory);
  }

  public handleSelectedCategoryBrandName(categoryBrandName: string): void {
    const selectedCategory = this.selectedCategorySignal();
    if (selectedCategory === null) return;
    const indexOfCategoryBrand = selectedCategory.brands.findIndex(
      (br) =>
        br.categoryName === selectedCategory.name &&
        br.brandName === categoryBrandName,
    );
    const selectedCategoryBrand: StatisticalCategoryBrand =
      selectedCategory.brands[indexOfCategoryBrand];
    this.selectedCategoryBrandSignal.set(selectedCategoryBrand);
    const geoOfSelectedCategoryBrand: StatisticalCategoryBrandGeo[] =
      selectedCategoryBrand.advertisementsGeo;
    const transportModelsOfSelectedCategoryBrand: StatisticalTransportModel[] =
      selectedCategoryBrand.transportModels;
    this.geoOfSelectedCategoryBrandSignal.set(geoOfSelectedCategoryBrand);
    this.transportModelsOfSelectedCategoryBrandSignal.set(
      transportModelsOfSelectedCategoryBrand,
    );
    console.log(this.transportModelsOfSelectedCategoryBrandSignal());
  }

  public detachSelectedCategory(): void {
    this.selectedCategorySignal.set(null);
    this.selectedCategoryBrandSignal.set(null);
    this.brandsOfSelectedCategorySignal.set([]);
    this.geoOfSelectedCategoryBrandSignal.set([]);
    this.transportModelsOfSelectedCategoryBrandSignal.set([]);
  }

  public detachSelectedBrand(): void {
    this.selectedCategoryBrandSignal.set(null);
    this.geoOfSelectedCategoryBrandSignal.set([]);
    this.transportModelsOfSelectedCategoryBrandSignal.set([]);
  }
}
