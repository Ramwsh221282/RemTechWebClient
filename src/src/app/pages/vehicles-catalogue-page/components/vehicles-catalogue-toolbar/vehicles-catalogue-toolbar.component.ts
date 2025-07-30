import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  Input,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { VehicleKind } from '../../../vehicles-catalogue-select-page/data/types/vehiclekind';
import { VehicleModel } from '../../../vehicles-catalogue-select-page/data/types/vehiclemodel';
import { VehicleBrand } from '../../../vehicles-catalogue-select-page/data/types/vehiclebrands';
import { ApiVehicleKindSource } from '../../../vehicles-catalogue-select-page/data/sources/apivehiclekindsource';
import { ApiVehicleModelsSource } from '../../../vehicles-catalogue-select-page/data/sources/apivehiclemodelssource';
import { StringUtils } from '../../../../shared/utils/string-utils';
import { VehicleKindSource } from '../../../vehicles-catalogue-select-page/data/sources/vehiclekindssource';
import { VehicleBrandsSource } from '../../../vehicles-catalogue-select-page/data/sources/vehiclebrandssource';
import { VehicleModelsSource } from '../../../vehicles-catalogue-select-page/data/sources/vehiclemodelssource';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ApiVehicleBrandsSource } from '../../../vehicles-catalogue-select-page/data/sources/apivehiclebrandssource';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { Ripple } from 'primeng/ripple';
import { Badge } from 'primeng/badge';
import { NgClass, NgIf } from '@angular/common';
import {
  CatalogueVehicleRegion,
  VehiclesCatalogueGeoLocations,
} from '../../Models/Catalogue/CatalogueVehicle';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-vehicles-catalogue-toolbar',
  imports: [Menubar, Ripple, Badge, NgClass, NgIf, Select],
  templateUrl: './vehicles-catalogue-toolbar.component.html',
  styleUrl: './vehicles-catalogue-toolbar.component.scss',
})
export class VehiclesCatalogueToolbarComponent {
  private readonly _currentKindId: WritableSignal<string>;
  private readonly _currentBrandId: WritableSignal<string>;
  private readonly _currentModelId: WritableSignal<string>;
  private readonly _regions: WritableSignal<VehiclesCatalogueGeoLocations[]>;
  private readonly _currentKind: WritableSignal<VehicleKind | null>;
  private readonly _currentModel: WritableSignal<VehicleModel | null>;
  private readonly _currentBrand: WritableSignal<VehicleBrand | null>;
  private readonly _kinds: WritableSignal<VehicleKind[]>;
  private readonly _brands: WritableSignal<VehicleBrand[]>;
  private readonly _models: WritableSignal<VehicleModel[]>;
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _kindsSource: VehicleKindSource;
  private readonly _brandsSource: VehicleBrandsSource;
  private readonly _modelsSource: VehicleModelsSource;
  private readonly _isLoading: WritableSignal<boolean>;

  constructor(
    kindsSource: ApiVehicleKindSource,
    brandsSource: ApiVehicleBrandsSource,
    modelsSource: ApiVehicleModelsSource,
  ) {
    this._currentKindId = signal('');
    this._currentBrandId = signal('');
    this._currentModelId = signal('');
    this._isLoading = signal(false);
    this._currentKind = signal(null);
    this._currentModel = signal(null);
    this._currentBrand = signal(null);
    this._regions = signal([]);
    this._kinds = signal([]);
    this._brands = signal([]);
    this._models = signal([]);
    this._kindsSource = kindsSource;
    this._brandsSource = brandsSource;
    this._modelsSource = modelsSource;
    effect((): void => {
      const kindId: string = this._currentKindId();
      if (!StringUtils.isEmptyOrWhiteSpace(kindId)) {
        this._isLoading.set(true);
        this._kindsSource
          .retrieve()
          .pipe(
            takeUntilDestroyed(this._destroyRef),
            finalize((): void => this._isLoading.set(false)),
          )
          .subscribe({
            next: (kinds: VehicleKind[]): void => {
              this._kinds.set(kinds);
              const currentKind: VehicleKind | undefined = kinds.find(
                (k: VehicleKind): boolean => k.id === kindId,
              );
              if (currentKind) this._currentKind.set(currentKind);
            },
          });
      }
    });
    effect((): void => {
      const currentKind: VehicleKind | null = this._currentKind();
      const currentBrandId: string = this._currentBrandId();
      if (currentKind && !StringUtils.isEmptyOrWhiteSpace(currentBrandId)) {
        this._isLoading.set(true);
        this._brandsSource
          .retrieve(currentKind)
          .pipe(
            takeUntilDestroyed(this._destroyRef),
            finalize((): void => this._isLoading.set(false)),
          )
          .subscribe({
            next: (brands: VehicleBrand[]): void => {
              this._brands.set(brands);
              const currentBrand: VehicleBrand | undefined = brands.find(
                (b: VehicleBrand): boolean => b.id === currentBrandId,
              );
              if (currentBrand) this._currentBrand.set(currentBrand);
            },
          });
      }
    });
    effect((): void => {
      const currentKind: VehicleKind | null = this._currentKind();
      const currentBrand: VehicleBrand | null = this._currentBrand();
      const currentModelId: string = this._currentModelId();
      if (
        currentKind &&
        currentBrand &&
        !StringUtils.isEmptyOrWhiteSpace(currentModelId)
      ) {
        this._isLoading.set(true);
        this._modelsSource
          .retrieve(currentKind, currentBrand)
          .pipe(
            takeUntilDestroyed(this._destroyRef),
            finalize((): void => this._isLoading.set(false)),
          )
          .subscribe({
            next: (models: VehicleModel[]): void => {
              this._models.set(models);
              const currentModel: VehicleModel | undefined = models.find(
                (m: VehicleModel): boolean => m.id === currentModelId,
              );
              if (currentModel) this._currentModel.set(currentModel);
            },
          });
      }
    });
  }

  menuItems: Signal<MenuItem[]> = computed((): MenuItem[] => {
    const currentKind: VehicleKind | null = this._currentKind();
    const currentBrand: VehicleBrand | null = this._currentBrand();
    const currentModel: VehicleModel | null = this._currentModel();
    const kinds: VehicleKind[] = this._kinds();
    const brands: VehicleBrand[] = this._brands();
    const models: VehicleModel[] = this._models();
    if (
      currentKind &&
      currentModel &&
      currentBrand &&
      kinds.length > 0 &&
      models.length > 0 &&
      brands.length > 0
    ) {
      return [
        {
          label: `Техника: ${currentKind.name}`,
          badge: kinds.length.toString(),
          items: kinds.map(
            (k: VehicleKind): MenuItem => ({
              label: k.name,
            }),
          ),
        },
        {
          label: `Марка: ${currentBrand.name}`,
          badge: brands.length.toString(),
          items: brands.map(
            (b: VehicleBrand): MenuItem => ({
              label: b.name,
            }),
          ),
        },
        {
          label: `Модель: ${currentModel.name}`,
          badge: models.length.toString(),
          items: models.map(
            (m: VehicleModel): MenuItem => ({
              label: m.name,
            }),
          ),
        },
      ];
    }
    return [];
  });

  @Input({ required: true }) set kind_id_setter(value: string) {
    this._currentKindId.set(value);
  }

  @Input({ required: true }) set brand_id_setter(value: string) {
    this._currentBrandId.set(value);
  }

  @Input({ required: true }) set model_id_setter(value: string) {
    this._currentModelId.set(value);
  }

  @Input() set regions_setter(value: VehiclesCatalogueGeoLocations[]) {
    this._regions.set(value);
  }

  public get regions(): VehiclesCatalogueGeoLocations[] {
    return this._regions();
  }
}
