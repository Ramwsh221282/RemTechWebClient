import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TransportItemsListComponent } from './components/transport-items-list/transport-items-list.component';
import { TransportItemsFilterFormComponent } from './components/transport-items-filter-form/transport-items-filter-form.component';
import { TransportItemPhotoGalleryDialogComponent } from './components/transport-item/transport-item-photo-gallery-dialog/transport-item-photo-gallery-dialog.component';
import { NgIf } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
  CharacteristicFilterOption,
} from './dto/advertisement-filter';
import { Advertisement } from './types/advertisement';
import { TransportCharacteristic } from './types/transport-characteristic';
import { finalize } from 'rxjs';
import { Divider } from 'primeng/divider';
import { TransportItemsPaginationComponent } from './components/transport-items-pagination/transport-items-pagination.component';
import { GeoInformation } from './types/geoinformation';
import { GeoInformationSelectDialogComponent } from './components/geo-information-select-dialog/geo-information-select-dialog.component';
import { PriceCriteriaFilterInputComponent } from './components/transport-items-filter-form/price-criteria-filter-input/price-criteria-filter-input.component';
import { CharacteristicsFilterInputComponent } from './components/transport-items-filter-form/characteristics-filter-input/characteristics-filter-input.component';
import {
  AggregatedScalarData,
  AggregatedScalarDataFactory,
} from './types/aggregated-scalar-data';
import { TransportCatalogueRouteBuilder } from './transport-catalogue-routes';
import { AdvertisementPricesResponse } from './types/advertisement-prices-response';
import { PricesChartComponent } from './components/transport-items-filter-form/prices-chart/prices-chart.component';

@Component({
  selector: 'app-transport-catalogue-page',
  imports: [
    PanelModule,
    ToolbarModule,
    CardModule,
    ButtonModule,
    PaginatorModule,
    TransportItemsListComponent,
    TransportItemsFilterFormComponent,
    TransportItemPhotoGalleryDialogComponent,
    NgIf,
    Divider,
    TransportItemsPaginationComponent,
    GeoInformationSelectDialogComponent,
    PriceCriteriaFilterInputComponent,
    CharacteristicsFilterInputComponent,
    RouterLink,
    PricesChartComponent,
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
  geoInformationSignal: WritableSignal<GeoInformation[]>;
  isSelectingGeoInformation: WritableSignal<boolean>;
  selectedGeoInformationSignal: WritableSignal<GeoInformation | null>;
  advertisementsPricesSignal: WritableSignal<AdvertisementPricesResponse>;
  scalarData: AggregatedScalarData;
  activatedRoute: ActivatedRoute;
  titleService: Title;
  httpService: TransportCataloguePageHttpService;
  routeBuilder: TransportCatalogueRouteBuilder;

  constructor(
    titleService: Title,
    activatedRoute: ActivatedRoute,
    httpService: TransportCataloguePageHttpService,
    routeBuilder: TransportCatalogueRouteBuilder,
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
    this.geoInformationSignal = signal([]);
    this.selectedGeoInformationSignal = signal(null);
    this.isSelectingGeoInformation = signal(false);
    this.advertisementsPricesSignal = signal({ prices: [] });
    this.scalarData = AggregatedScalarDataFactory.default();
    this.routeBuilder = routeBuilder;
  }

  public ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const geoId: string | undefined = params['geoId'];
      const modelName: string | undefined = params['modelName'];

      this.paginationSignal = signal(PaginationService.initialized(1, 10));
      this.filterSignal = signal(AdvertisementFilterService.createEmpty());

      const categoryId: string = params['id'];
      const brandId: string = params['brandid'];

      this.httpService
        .fetchCharacteristics(categoryId, brandId)
        .subscribe((result) => {
          if (result.code === 200) {
            const data = result.data;
            this.characteristicsSignal.set(data);

            if (modelName) {
              const modelCharacteristicIndex: number = data.findIndex(
                (ctx) => ctx.name === 'модель',
              );
              if (modelCharacteristicIndex >= 0) {
                const modelCharacteristics: TransportCharacteristic =
                  data[modelCharacteristicIndex];
                const selectedModelIndex =
                  modelCharacteristics.values.findIndex((m) => m === modelName);

                if (selectedModelIndex >= 0) {
                  const characteristic: CharacteristicFilterOption = {
                    name: 'модель',
                    value: modelCharacteristics.values[selectedModelIndex],
                  };

                  this.filterSignal.update((prev) => {
                    return AdvertisementFilterService.applyCharacteristic(
                      prev,
                      characteristic,
                    );
                  });
                }
              }
            }
          }
        });

      this.httpService
        .fetchGeoInformation(categoryId, brandId)
        .subscribe((result) => {
          if (result.code === 200) {
            const data: GeoInformation[] = result.data;
            this.geoInformationSignal.set(data);

            if (geoId && geoId !== 'любой') {
              const selectedGeoIndex: number = data.findIndex(
                (geo): boolean => geo.id === geoId,
              );
              if (selectedGeoIndex >= 0) {
                const selectedGeo = data[selectedGeoIndex];
                this.selectedGeoInformationSignal.set(selectedGeo);
                this.filterSignal.update(
                  (prev: AdvertisementFilter): AdvertisementFilter => {
                    return AdvertisementFilterService.applyAddress(
                      prev,
                      selectedGeo.id,
                    );
                  },
                );
              }
            }
          }
        });

      this.httpService
        .fetchCategoryBrands(categoryId, brandId)
        .subscribe((result) => {
          this.categorySignal.set(result.category);
          this.brandSignal.set(result.categoryBrand);
          this.titleService.setTitle(
            `Список спец.техники ${result.category.name} ${result.categoryBrand.name}`,
          );
          this.refetchAdvertisements();
          this.refetchPrices();
        });
    });
  }

  public openGeoInformationSelectDialog($event: MouseEvent): void {
    $event.stopPropagation();
    this.isSelectingGeoInformation.set(true);
  }

  public handleGeoInformationClosed($event: boolean): void {
    this.isSelectingGeoInformation.set(false);
  }

  public onAdvertisementPhotoViewOpen(advertisement: Advertisement): void {
    this.selectedAdvertisement.set(advertisement);
  }

  public onAdvertisementPhotoViewClose(): void {
    this.selectedAdvertisement.set(null);
  }

  public onPageChanged(pagination: Pagination): void {
    this.paginationSignal.set(pagination);
    this.refetchAdvertisements();
  }

  private refetchAdvertisements(): void {
    this.isLoading.set(true);
    this.httpService
      .fetchAdvertisements(
        this.categorySignal().id,
        this.brandSignal().brandId,
        this.filterSignal(),
        this.paginationSignal(),
        this.sortSignal(),
      )
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((result) => {
        if (result.code === 200) {
          this.advertisementsSignal.set(result.data.advertisements);
          this.totalPagesCountSignal.set(result.data.totals);
          this.scalarData =
            AggregatedScalarDataFactory.fromAdvertisementsPageResponse(
              result.data,
            );
        }
      });
  }

  private refetchPrices(): void {
    this.httpService
      .fetchPrices(
        this.categorySignal().id,
        this.brandSignal().brandId,
        this.filterSignal(),
      )
      .subscribe((result) => {
        if (result.code === 200) {
          this.advertisementsPricesSignal.set(result.data);
        }
      });
  }

  public acceptTextSearch(searchTerm: string): void {
    const filter: AdvertisementFilter = this.filterSignal();
    const updated = AdvertisementFilterService.applyTextFilter(
      filter,
      searchTerm,
    );
    this.filterSignal.set(updated);
    this.refetchAdvertisements();
    this.refetchPrices();
  }

  public acceptGeoInformationChange(geoInformation: GeoInformation): void {
    if (geoInformation.details === 'Любой') {
      this.selectedGeoInformationSignal.set(null);
      this.filterSignal.update((prev): AdvertisementFilter => {
        return AdvertisementFilterService.applyAddress(prev, '');
      });
      this.refetchAdvertisements();
      return;
    }

    this.selectedGeoInformationSignal.set(geoInformation);
    this.filterSignal.update((prev): AdvertisementFilter => {
      return AdvertisementFilterService.applyAddress(
        prev,
        this.selectedGeoInformationSignal()!.id,
      );
    });
    this.refetchAdvertisements();
    this.refetchPrices();
  }

  public acceptCharacteristicChange(
    characteristic: CharacteristicFilterOption,
  ): void {
    const filter: AdvertisementFilter = this.filterSignal();
    const updatedFilter: AdvertisementFilter =
      AdvertisementFilterService.applyCharacteristic(filter, characteristic);
    this.filterSignal.set(updatedFilter);
    this.refetchPrices();
    this.refetchAdvertisements();
  }

  public acceptCharacteristicsFlush(): void {
    const filter: AdvertisementFilter = this.filterSignal();
    if (filter.characteristicsFilter.characteristics.length === 0) return;
    const updatedFilter: AdvertisementFilter =
      AdvertisementFilterService.appplyCharacteristics(filter, []);
    this.filterSignal.set(updatedFilter);
    this.refetchPrices();
    this.refetchAdvertisements();
  }

  public acceptSortChange(sort: Sorting): void {
    this.sortSignal.set(sort);
    this.refetchAdvertisements();
  }

  public acceptPriceFromChange(value: string): void {
    const filter: AdvertisementFilter = this.filterSignal();
    const updated = AdvertisementFilterService.applyPriceFrom(filter, value);
    this.filterSignal.set(updated);
  }

  public acceptPriceToChange(value: string): void {
    const filter: AdvertisementFilter = this.filterSignal();
    const updated = AdvertisementFilterService.applyPriceTo(filter, value);
    this.filterSignal.set(updated);
  }

  public acceptPriceFlush(): void {
    const filter: AdvertisementFilter = this.filterSignal();
    const updated = AdvertisementFilterService.resetPrice(filter);
    this.filterSignal.set(updated);
    this.refetchAdvertisements();
  }

  public acceptPriceFilterSubmit(): void {
    this.refetchAdvertisements();
  }
}
