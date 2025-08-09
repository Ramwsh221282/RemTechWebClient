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
import { Dialog } from 'primeng/dialog';
import { Select, SelectChangeEvent } from 'primeng/select';
import { Button } from 'primeng/button';
import { BasicVehicleKind } from '../../types/BasicVehicleKind';
import { BasicVehicleBrand } from '../../types/BasicVehicleBrand';
import { BasicVehicleModel } from '../../types/BasicVehicleModel';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BasicVehicleKindsSource } from '../../services/data-sources/BasicVehicleKindsSource';
import { BasicVehicleBrandsSource } from '../../services/data-sources/BasicVehicleBrandsSource';
import { BasicVehicleModelsSource } from '../../services/data-sources/BasicVehicleModelsSource';
import { CatalogueNavigationChange } from '../../types/CatalogueNavigationChange';

@Component({
  selector: 'app-vehicles-select-navigation-change-dialog',
  imports: [Dialog, Select, Button, FormsModule],
  templateUrl: './vehicles-select-navigation-change-dialog.component.html',
  styleUrl: './vehicles-select-navigation-change-dialog.component.scss',
})
export class VehiclesSelectNavigationChangeDialogComponent {
  @Output() navigationParamsChange: EventEmitter<CatalogueNavigationChange> =
    new EventEmitter<CatalogueNavigationChange>();
  private readonly _visibility: WritableSignal<boolean>;
  private readonly _currentKind: WritableSignal<BasicVehicleKind | undefined>;
  private readonly _currentBrand: WritableSignal<BasicVehicleBrand | undefined>;
  private readonly _currentModel: WritableSignal<BasicVehicleModel | undefined>;
  private readonly _kinds: WritableSignal<BasicVehicleKind[]>;
  private readonly _brands: WritableSignal<BasicVehicleBrand[]>;
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _brandsSource: BasicVehicleBrandsSource;
  private readonly _modelsSource: BasicVehicleModelsSource;

  @Output() dialogClosed: EventEmitter<void> = new EventEmitter();

  constructor(
    kindsSource: BasicVehicleKindsSource,
    brandsSource: BasicVehicleBrandsSource,
    modelsSource: BasicVehicleModelsSource,
  ) {
    this._brandsSource = brandsSource;
    this._modelsSource = modelsSource;
    this._visibility = signal(false);
    this._currentKind = signal(undefined);
    this._currentBrand = signal(undefined);
    this._currentModel = signal(undefined);
    this._kinds = signal([]);
    this._brands = signal([]);
    effect((): void => {
      kindsSource
        .fetch()
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (kinds: BasicVehicleKind[]): void => {
            this._kinds.set(kinds);
            const currentKind = this._currentKind();
            if (currentKind) {
              const newCurrentKind = kinds.find((k) => k.id === currentKind.id);
              if (newCurrentKind) {
                this._currentKind.set(newCurrentKind);
                brandsSource
                  .fetch(currentKind.id)
                  .pipe(takeUntilDestroyed(this._destroyRef))
                  .subscribe({
                    next: (brands: BasicVehicleBrand[]): void => {
                      this._brands.set(brands);
                      const currentBrand = this._currentBrand();
                      if (currentBrand) {
                        const newCurrentBrand = brands.find(
                          (brand) => brand.id === currentBrand.id,
                        );
                        if (newCurrentBrand) {
                          this._currentBrand.set(newCurrentBrand);
                        }
                      }
                    },
                  });
              }
            }
          },
        });
    });
  }

  public kindChanged($event: SelectChangeEvent): void {
    const kind: BasicVehicleKind = $event.value as BasicVehicleKind;
    this._currentKind.set(kind);
    this._brandsSource
      .fetch(kind.id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (brands: BasicVehicleBrand[]): void => {
          this._brands.set(brands);
          this._currentBrand.set(brands[0]);
          this._modelsSource.fetch(brands[0].id, kind.id).subscribe({
            next: (models: BasicVehicleModel[]): void => {
              this._currentModel.set(models[0]);
            },
          });
        },
      });
  }

  public brandChanged($event: SelectChangeEvent): void {
    const brand: BasicVehicleBrand = $event.value as BasicVehicleBrand;
    const kind: BasicVehicleKind | undefined = this._currentKind();
    this._currentBrand.set(brand);
    if (kind) {
      this._modelsSource
        .fetch(brand.id, kind.id)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (models: BasicVehicleModel[]): void => {
            this._currentModel.set(models[0]);
          },
        });
    }
  }

  @Input({ required: true }) set visibility_setter(value: boolean) {
    this._visibility.set(value);
  }

  @Input() set current_kind_setter(value: BasicVehicleKind | null) {
    if (value) {
      this._currentKind.set(value);
    }
  }

  @Input() set current_brand_setter(value: BasicVehicleBrand | null) {
    if (value) {
      this._currentBrand.set(value);
    }
  }

  public get currentKind(): BasicVehicleKind | undefined {
    return this._currentKind();
  }

  public get currentBrand(): BasicVehicleBrand | undefined {
    return this._currentBrand();
  }

  public get kinds(): BasicVehicleKind[] {
    return this._kinds();
  }

  public get brands(): BasicVehicleBrand[] {
    return this._brands();
  }

  public get visibility(): boolean {
    return this._visibility();
  }

  public closeDialog(): void {
    this.dialogClosed.emit();
  }

  public confirmChange(): void {
    const currentKind = this._currentKind();
    const currentModel = this._currentModel();
    const currentBrand = this._currentBrand();
    if (currentModel && currentBrand && currentKind) {
      this.navigationParamsChange.emit({
        kind: currentKind,
        brand: currentBrand,
      });
    }
  }
}
