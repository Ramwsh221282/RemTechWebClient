import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TransportItemsListComponent } from './components/transport-items-list/transport-items-list.component';
import { TransportItemsFilterFormComponent } from './components/transport-items-filter-form/transport-items-filter-form.component';
import { TransportItemPhotoGalleryDialogComponent } from './components/transport-item/transport-item-photo-gallery-dialog/transport-item-photo-gallery-dialog.component';
import { NgIf } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import {
  TransportCategory,
  TransportCategoryFactory,
} from './transport-categories-menu/types/TransportCategory';
import { Pagination, PaginationService } from '../../shared/types/Pagination';
import { TransportCataloguePageHttpService } from './services/transport-catalogue-page.http.service';
import { Sorting, SortingFactory } from '../../shared/types/Sorting';
import {
  CategoryBrand,
  CategoryBrandFactory,
} from './category-brands-menu/types/category-brand';
import {
  AdvertisementFilter,
  AdvertisementFilterService,
} from './dto/advertisement-filter';
import { Advertisement } from './types/advertisement';
import { TransportCharacteristic } from './types/transport-characteristic';
import { finalize } from 'rxjs';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'app-transport-catalogue-page',
  imports: [
    PanelModule,
    ToolbarModule,
    SearchBarComponent,
    CardModule,
    ButtonModule,
    PaginatorModule,
    TransportItemsListComponent,
    TransportItemsFilterFormComponent,
    TransportItemPhotoGalleryDialogComponent,
    NgIf,
    Divider,
  ],
  templateUrl: './transport-catalogue-page.component.html',
  styleUrl: './transport-catalogue-page.component.scss',
})
export class TransportCataloguePageComponent implements OnInit {
  categorySignal: WritableSignal<TransportCategory>;
  brandSignal: WritableSignal<CategoryBrand>;
  advertisementsSignal: WritableSignal<Advertisement[]>;
  paginationSignal: WritableSignal<Pagination>;
  sortSignal: WritableSignal<Sorting>;
  filterSignal: WritableSignal<AdvertisementFilter>;
  totalPagesCountSignal: WritableSignal<number>;
  characteristicsSignal: WritableSignal<TransportCharacteristic[]>;
  selectedAdvertisement: WritableSignal<Advertisement | null>;
  isLoading: WritableSignal<boolean>;
  activatedRoute: ActivatedRoute;
  titleService: Title;
  httpService: TransportCataloguePageHttpService;

  public constructor(
    titleService: Title,
    activatedRoute: ActivatedRoute,
    httpService: TransportCataloguePageHttpService,
  ) {
    titleService.setTitle('Список спец.техники');
    this.httpService = httpService;
    this.activatedRoute = activatedRoute;
    this.titleService = titleService;
    this.categorySignal = signal(TransportCategoryFactory.default());
    this.brandSignal = signal(CategoryBrandFactory.default());
    this.advertisementsSignal = signal([]);
    this.characteristicsSignal = signal([]);
    this.totalPagesCountSignal = signal(0);
    this.selectedAdvertisement = signal(null);
    this.paginationSignal = signal(PaginationService.initialized(1, 10));
    this.sortSignal = signal(SortingFactory.default());
    this.filterSignal = signal(AdvertisementFilterService.createEmpty());
    this.isLoading = signal(false);
  }

  public ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const categoryId = params['id'];
      const brandId = params['brandid'];
      this.httpService
        .fetchCategoryBrands(categoryId, brandId)
        .subscribe((result) => {
          this.categorySignal.set(result.category);
          this.brandSignal.set(result.categoryBrand);
          this.titleService.setTitle(
            `Список спец.техники ${result.category.name} ${result.categoryBrand.name}`,
          );
        });
      this.isLoading.set(true);
      this.httpService
        .fetchAdvertisements(
          categoryId,
          brandId,
          this.filterSignal(),
          this.paginationSignal(),
          this.sortSignal(),
        )
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe((result) => {
          if (result.code === 200) {
            this.advertisementsSignal.set(result.data.advertisements);
            this.totalPagesCountSignal.set(result.data.totals);
          }
        });
      this.httpService.fetchCharacteristics().subscribe((result) => {
        if (result.code === 200) this.characteristicsSignal.set(result.data);
      });
    });
  }

  public onAdvertisementPhotoViewClose(): void {
    this.selectedAdvertisement.set(null);
  }

  public acceptTextSearch(searchTerm: string): void {}
}
