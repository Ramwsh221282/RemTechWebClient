import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Button } from 'primeng/button';
import { Panel } from 'primeng/panel';
import { Select, SelectChangeEvent } from 'primeng/select';
import { TransportCategory } from '../../../transport-catalogue-page/transport-categories-menu/types/TransportCategory';
import { CategoryBrand } from '../../../transport-catalogue-page/category-brands-menu/types/category-brand';
import { GeoInformation } from '../../../transport-catalogue-page/types/geoinformation';
import { TransportModelDto } from '../../../transport-catalogue-page/dto/advertisement-dto';
import { TransportCategoriesHttpService } from '../../../transport-catalogue-page/transport-categories-menu/services/transport-categories-http.service';
import { CategoryBrandsHttpService } from '../../../transport-catalogue-page/category-brands-menu/services/category-brands-http.service';
import { AdvertisementsHttpService } from '../../../transport-catalogue-page/services/advertisements-http.service';
import { PrimeNgSelectUtil } from '../../../../shared/utils/primeng-select-util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page-head-search',
  imports: [Button, Panel, Select],
  templateUrl: './main-page-head-search.component.html',
  styleUrl: './main-page-head-search.component.scss',
})
export class MainPageHeadSearchComponent implements OnInit {
  private readonly _categoriesHttpService: TransportCategoriesHttpService;
  private readonly _brandsHttpService: CategoryBrandsHttpService;
  private readonly _advertisementsHttpService: AdvertisementsHttpService;
  private readonly _router: Router;

  readonly categories: WritableSignal<TransportCategory[]>;
  readonly brands: WritableSignal<CategoryBrand[]>;
  readonly geoLocations: WritableSignal<GeoInformation[]>;
  readonly transportModels: WritableSignal<TransportModelDto[]>;

  readonly selectedCategory: WritableSignal<TransportCategory | null>;
  readonly selectedBrand: WritableSignal<CategoryBrand | null>;
  readonly selectedGeoLocation: WritableSignal<GeoInformation | null>;
  readonly selectedModel: WritableSignal<TransportModelDto | null>;

  public constructor(
    categoriesHttpService: TransportCategoriesHttpService,
    brandsHttpService: CategoryBrandsHttpService,
    advertisementsHttpService: AdvertisementsHttpService,
    router: Router,
  ) {
    this.categories = signal([]);
    this.brands = signal([]);
    this.geoLocations = signal([]);
    this.transportModels = signal([]);
    this._router = router;

    this.selectedCategory = signal(null);
    this.selectedBrand = signal(null);
    this.selectedGeoLocation = signal(null);
    this.selectedModel = signal(null);

    this._categoriesHttpService = categoriesHttpService;
    this._brandsHttpService = brandsHttpService;
    this._advertisementsHttpService = advertisementsHttpService;
  }

  public ngOnInit(): void {
    this._categoriesHttpService.fetchCategories().subscribe((response) => {
      if (response.code === 200) {
        const data = response.data;
        this.categories.set(data);
      }
    });
  }

  public onCategorySelect($event: SelectChangeEvent): void {
    const category: TransportCategory =
      PrimeNgSelectUtil.convertToObject<TransportCategory>($event);

    this.selectedCategory.set(category);
    this._brandsHttpService.setCategoryId(category.id);
    this._brandsHttpService.fetchCategoryBrands().subscribe((response) => {
      if (response.code === 200) {
        const data = response.data;
        this.brands.set(data);
      }
    });
  }

  public onBrandSelect($event: SelectChangeEvent): void {
    const brand: CategoryBrand =
      PrimeNgSelectUtil.convertToObject<CategoryBrand>($event);

    this.selectedBrand.set(brand);

    this._advertisementsHttpService
      .fetchAdvertisementsGeoInformation(brand.categoryId, brand.brandId)
      .subscribe((response) => {
        if (response.code === 200) {
          const data = response.data;
          this.geoLocations.set(data);
        }
      });

    this._advertisementsHttpService
      .fetchTransportModels(brand.categoryId, brand.brandId)
      .subscribe((response) => {
        if (response.code === 200) {
          const data = response.data;
          this.transportModels.set(data);
        }
      });
  }

  public onGeoLocationSelect($event: SelectChangeEvent): void {
    const geo: GeoInformation =
      PrimeNgSelectUtil.convertToObject<GeoInformation>($event);

    this.selectedGeoLocation.set(geo);

    const categoryId = this.selectedCategory()!.id;
    const brandId = this.selectedBrand()!.brandId;

    this._advertisementsHttpService
      .fetchTransportModels(categoryId, brandId, geo.id)
      .subscribe((response) => {
        this.transportModels.set([]);
        if (response.code === 200) {
          const data = response.data;
          this.transportModels.set(data);
        }
      });
  }

  public onTransportModelSelect($event: SelectChangeEvent): void {
    const model = PrimeNgSelectUtil.convertToObject<TransportModelDto>($event);
    this.selectedModel.set(model);
  }

  public navigateCatalogue(): void {
    const category = this.selectedCategory();
    const brand = this.selectedBrand();

    if (!category || !brand) return;

    const categoryId = category.id;
    const brandId = brand.brandId;
    const geoLocationId = this.selectedGeoLocation()?.id;
    const modelName = this.selectedModel()?.value;

    let path = `transport-catalogue/categories/${categoryId}/brands/${brandId}/transports`;

    if (geoLocationId) path += `/geo/${geoLocationId}`;
    if (modelName) path += `/models/${modelName}`;

    this._router.navigate([path]);
  }
}
