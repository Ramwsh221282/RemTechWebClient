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
import { Select, SelectChangeEvent } from 'primeng/select';
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
import { VehicleBrand } from '../../../vehicles-catalogue-select-page/data/types/vehiclebrands';
import { VehicleKind } from '../../../vehicles-catalogue-select-page/data/types/vehiclekind';
import { VehicleCatalogueQueryWithOtherModel } from '../../Models/Query/VehiclesCatalogueQuery';
import { VehicleModelQueryArgument } from '../../Models/QueryArguments/QueryArguments';

@Component({
  selector: 'app-vehicles-catalogue-toolbar',
  imports: [
    Button,
    Toolbar,
    VehiclesSelectNavigationChangeDialogComponent,
    NgIf,
    Select,
  ],
  templateUrl: './vehicles-catalogue-toolbar.component.html',
  styleUrl: './vehicles-catalogue-toolbar.component.scss',
})
export class VehiclesCatalogueToolbarComponent {
  @Output() navigationChanged: EventEmitter<CatalogueNavigationChange> =
    new EventEmitter<CatalogueNavigationChange>();
  @Output() onCurrentKindNameFetched: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() onCurrentBrandNameFetched: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() modelSelected: EventEmitter<VehicleModelQueryArgument> =
    new EventEmitter();
  private readonly _currentKindId: WritableSignal<string>;
  private readonly _currentBrandId: WritableSignal<string>;
  private readonly _currentKind: WritableSignal<BasicVehicleKind | null>;
  private readonly _currentBrand: WritableSignal<BasicVehicleBrand | null>;
  private readonly _kinds: WritableSignal<BasicVehicleKind[]>;
  private readonly _brands: WritableSignal<BasicVehicleBrand[]>;
  private readonly _models: WritableSignal<BasicVehicleModel[]>;
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _changeNavigationDialogVisibility: WritableSignal<boolean>;
  private _isKindFirstlyInited: boolean = false;
  private _isBrandsFirstlyInited: boolean = false;

  constructor(
    kindsSource: BasicVehicleKindsSource,
    brandsSource: BasicVehicleBrandsSource,
    modelsSource: BasicVehicleModelsSource,
  ) {
    this._changeNavigationDialogVisibility = signal(false);
    this._currentKindId = signal('');
    this._currentBrandId = signal('');
    this._currentKind = signal(null);
    this._currentBrand = signal(null);
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
              if (currentKind) {
                this._currentKind.set(currentKind);
                this.onCurrentKindNameFetched.emit(currentKind.name);
              }
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
                if (currentBrand) {
                  this._currentBrand.set(currentBrand);
                  this.onCurrentBrandNameFetched.emit(currentBrand.name);
                }
                this._isBrandsFirstlyInited = true;
              }
            },
          });
      }
    });

    effect((): void => {
      const brand: BasicVehicleBrand | null = this._currentBrand();
      const kind: BasicVehicleKind | null = this._currentKind();
      if (brand && kind) {
        modelsSource
          .fetch(brand.id, kind.id)
          .pipe(takeUntilDestroyed(this._destroyRef))
          .subscribe({
            next: (models: BasicVehicleModel[]): void => {
              this._models.set(models);
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

  public get currentKindName(): string {
    const kind: BasicVehicleKind | null = this._currentKind();
    return kind === null ? '' : kind.name;
  }

  public get models(): BasicVehicleModel[] {
    const models: BasicVehicleModel[] = [
      { id: '', name: 'Любая' },
      ...this._models(),
    ];
    return models;
  }

  public onModelSelect($event: SelectChangeEvent): void {
    const model: BasicVehicleModel = $event.value as BasicVehicleModel;
    if (model.name === 'Любая') {
      this.modelSelected.emit(new VehicleModelQueryArgument(null));
      return;
    }
    this.modelSelected.emit(new VehicleModelQueryArgument(model.id));
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
    this._currentKind.set(kind);
    this._currentBrand.set(brand);
    this.navigationChanged.emit($event);
    this.turnOffChangeNavigationDialogVisibility();
  }
}
