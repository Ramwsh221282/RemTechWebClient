import {
  Component,
  DestroyRef,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { StringUtils } from '../../../../shared/utils/string-utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VehiclesCatalogueGeoLocations } from '../../Models/Catalogue/CatalogueVehicle';
import { Select } from 'primeng/select';
import { BasicVehicleKindsSource } from '../../services/data-sources/BasicVehicleKindsSource';
import { BasicVehicleKind } from '../../types/BasicVehicleKind';
import { BasicVehicleBrandsSource } from '../../services/data-sources/BasicVehicleBrandsSource';
import { BasicVehicleModelsSource } from '../../services/data-sources/BasicVehicleModelsSource';
import { BasicVehicleBrand } from '../../types/BasicVehicleBrand';
import { BasicVehicleModel } from '../../types/BasicVehicleModel';
import { Button } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';
import { VehiclesSelectNavigationChangeDialogComponent } from '../vehicles-select-navigation-change-dialog/vehicles-select-navigation-change-dialog.component';
import { NgIf } from '@angular/common';
import { CatalogueNavigationChange } from '../../types/CatalogueNavigationChange';

@Component({
  selector: 'app-vehicles-catalogue-toolbar',
  imports: [
    Select,
    Button,
    Toolbar,
    VehiclesSelectNavigationChangeDialogComponent,
    NgIf,
  ],
  templateUrl: './vehicles-catalogue-toolbar.component.html',
  styleUrl: './vehicles-catalogue-toolbar.component.scss',
})
export class VehiclesCatalogueToolbarComponent {
  @Output() navigationChanged: EventEmitter<CatalogueNavigationChange> =
    new EventEmitter<CatalogueNavigationChange>();
  private readonly _currentKindId: WritableSignal<string>;
  private readonly _currentBrandId: WritableSignal<string>;
  private readonly _currentModelId: WritableSignal<string>;
  private readonly _regions: WritableSignal<VehiclesCatalogueGeoLocations[]>;
  private readonly _currentKind: WritableSignal<BasicVehicleKind | null>;
  private readonly _currentModel: WritableSignal<BasicVehicleModel | null>;
  private readonly _currentBrand: WritableSignal<BasicVehicleBrand | null>;
  private readonly _kinds: WritableSignal<BasicVehicleKind[]>;
  private readonly _brands: WritableSignal<BasicVehicleBrand[]>;
  private readonly _models: WritableSignal<BasicVehicleModel[]>;
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _changeNavigationDialogVisibility: WritableSignal<boolean>;
  private _isKindFirstlyInited: boolean = false;
  private _isBrandsFirstlyInited: boolean = false;
  private _isModelsFirstlyInited: boolean = false;

  constructor(
    kindsSource: BasicVehicleKindsSource,
    brandsSource: BasicVehicleBrandsSource,
    modelsSource: BasicVehicleModelsSource,
  ) {
    this._changeNavigationDialogVisibility = signal(false);
    this._currentKindId = signal('');
    this._currentBrandId = signal('');
    this._currentModelId = signal('');
    this._currentKind = signal(null);
    this._currentModel = signal(null);
    this._currentBrand = signal(null);
    this._regions = signal([]);
    this._kinds = signal([]);
    this._brands = signal([]);
    this._models = signal([]);
    effect((): void => {
      if (this._isKindFirstlyInited) return;
      const kindId: string = this._currentKindId();
      kindsSource
        .fetch()
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (kinds: BasicVehicleKind[]): void => {
            this._kinds.set(kinds);
            if (!StringUtils.isEmptyOrWhiteSpace(kindId)) {
              const currentKind: BasicVehicleKind | undefined = kinds.find(
                (k: BasicVehicleKind): boolean => k.id === kindId,
              );
              if (currentKind) this._currentKind.set(currentKind);
              this._isKindFirstlyInited = true;
            }
          },
        });
    });
    effect((): void => {
      if (this._isBrandsFirstlyInited) return;
      const currentKind: BasicVehicleKind | null = this._currentKind();
      const currentBrandId: string = this._currentBrandId();
      if (currentKind) {
        brandsSource
          .fetch(currentKind.id)
          .pipe(takeUntilDestroyed(this._destroyRef))
          .subscribe({
            next: (brands: BasicVehicleBrand[]): void => {
              this._brands.set(brands);
              if (!StringUtils.isEmptyOrWhiteSpace(currentBrandId)) {
                const currentBrand: BasicVehicleBrand | undefined = brands.find(
                  (b: BasicVehicleBrand): boolean => b.id === currentBrandId,
                );
                if (currentBrand) this._currentBrand.set(currentBrand);
                this._isBrandsFirstlyInited = true;
              }
            },
          });
      }
    });
    effect((): void => {
      if (this._isModelsFirstlyInited) return;
      const currentBrand: BasicVehicleBrand | null = this._currentBrand();
      const currentKind: BasicVehicleKind | null = this._currentKind();
      const currentModelId: string = this._currentModelId();
      if (currentBrand && currentKind) {
        modelsSource
          .fetch(currentBrand.id, currentKind.id)
          .pipe(takeUntilDestroyed(this._destroyRef))
          .subscribe({
            next: (models: BasicVehicleModel[]): void => {
              this._models.set(models);
              if (!StringUtils.isEmptyOrWhiteSpace(currentModelId)) {
                const currentModel: BasicVehicleModel | undefined = models.find(
                  (m: BasicVehicleModel): boolean => m.id === currentModelId,
                );
                if (currentModel) this._currentModel.set(currentModel);
                this._isModelsFirstlyInited = true;
              }
            },
          });
      }
    });
  }

  @Input({ required: true }) set kind_id_setter(value: string) {
    if (!this._isKindFirstlyInited) {
      this._currentKindId.set(value);
    }
  }

  @Input({ required: true }) set brand_id_setter(value: string) {
    if (!this._isBrandsFirstlyInited) {
      this._currentBrandId.set(value);
    }
  }

  @Input({ required: true }) set model_id_setter(value: string) {
    if (!this._isModelsFirstlyInited) {
      this._currentModelId.set(value);
    }
  }

  @Input() set regions_setter(value: VehiclesCatalogueGeoLocations[]) {
    this._regions.set(value);
  }

  public get regions(): VehiclesCatalogueGeoLocations[] {
    return this._regions();
  }

  public get currentKindName(): string {
    const kind: BasicVehicleKind | null = this._currentKind();
    return kind === null ? '' : kind.name;
  }

  public get currentKind(): BasicVehicleKind | null {
    return this._currentKind();
  }

  public get currentBrandName(): string {
    const brand: BasicVehicleBrand | null = this._currentBrand();
    return brand === null ? '' : brand.name;
  }

  public get currentBrand(): BasicVehicleBrand | null {
    return this._currentBrand();
  }

  public get currentModel(): BasicVehicleModel | null {
    return this._currentModel();
  }

  public get currentModelName(): string {
    const model: BasicVehicleModel | null = this._currentModel();
    return model === null ? '' : model.name;
  }

  public get changeNavigationDialogVisibility(): boolean {
    return this._changeNavigationDialogVisibility();
  }

  public turnChangeNavigationDialogVisibility(): void {
    const current: boolean = this._changeNavigationDialogVisibility();
    if (current) return;
    this._changeNavigationDialogVisibility.set(!current);
  }

  public turnOffChangeNavigationDialogVisibility(): void {
    const current: boolean = this._changeNavigationDialogVisibility();
    if (!current) return;
    this._changeNavigationDialogVisibility.set(!current);
  }

  public acceptNavigationChange($event: CatalogueNavigationChange): void {
    const kind = $event.kind;
    const brand = $event.brand;
    const model = $event.model;
    this._currentKind.set(kind);
    this._currentBrand.set(brand);
    this._currentModel.set(model);
    this.navigationChanged.emit($event);
    this.turnOffChangeNavigationDialogVisibility();
  }
}
