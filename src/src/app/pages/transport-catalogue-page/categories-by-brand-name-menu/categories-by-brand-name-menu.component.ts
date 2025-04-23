import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AdvertisementsHttpService } from '../services/advertisements-http.service';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Panel } from 'primeng/panel';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ScrollPanel } from 'primeng/scrollpanel';
import { SearchBarComponent } from '../../../shared/components/search-bar/search-bar.component';
import {
  CategoryBrand,
  CategoryBrandFactory,
} from '../category-brands-menu/types/category-brand';
import { TransportCatalogueRouteBuilder } from '../transport-catalogue-routes';
import { finalize } from 'rxjs';
import { CategoryOfConcreteBrand } from '../category-brands-menu/types/category-of-concrete-brand';

@Component({
  selector: 'app-categories-by-brand-name-menu',
  imports: [
    Button,
    Divider,
    Panel,
    ProgressSpinner,
    ScrollPanel,
    SearchBarComponent,
    RouterLink,
  ],
  templateUrl: './categories-by-brand-name-menu.component.html',
  styleUrl: './categories-by-brand-name-menu.component.scss',
})
export class CategoriesByBrandNameMenuComponent implements OnInit {
  private readonly _activatedRoute: ActivatedRoute;
  private readonly _httpService: AdvertisementsHttpService;
  readonly categoriesSignal: WritableSignal<CategoryOfConcreteBrand[]>;
  readonly isLoadingSignal: WritableSignal<boolean>;
  readonly routeBuilder;
  brand: CategoryBrand;

  constructor(
    activatedRoute: ActivatedRoute,
    httpService: AdvertisementsHttpService,
    routeBuilder: TransportCatalogueRouteBuilder,
  ) {
    this._activatedRoute = activatedRoute;
    this._httpService = httpService;
    this.categoriesSignal = signal([]);
    this.brand = CategoryBrandFactory.default();
    this.isLoadingSignal = signal(false);
    this.routeBuilder = routeBuilder;
  }

  ngOnInit(): void {
    this.isLoadingSignal.set(true);
    this._activatedRoute.params.subscribe((params) => {
      const brandId = params['brandId'] as string;
      const brandName = params['name'] as string;
      this.brand = { brandId: brandId, categoryId: '', name: brandName };
      this._httpService
        .fetchCategoriesOfBrand(brandId, brandName)
        .pipe(finalize(() => this.isLoadingSignal.set(false)))
        .subscribe((response) => {
          if (response.code === 200) this.categoriesSignal.set(response.data);
        });
    });
  }
}
