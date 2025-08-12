import {
  Component,
  DestroyRef,
  effect,
  EventEmitter,
  inject,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CatalogueVehiclesService } from '../../services/CatalogueVehiclesService';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Select, SelectChangeEvent } from 'primeng/select';
import { CatalogueBrand } from '../../types/CatalogueBrand';

@Component({
  selector: 'app-vehicle-brand-filter-form-part',
  imports: [FormsModule, Select],
  templateUrl: './vehicle-brand-filter-form-part.component.html',
  styleUrl: './vehicle-brand-filter-form-part.component.scss',
})
export class VehicleBrandFilterFormPartComponent {
  @Output() onBrandChange: EventEmitter<string | undefined> =
    new EventEmitter();
  private readonly _brands: WritableSignal<CatalogueBrand[]>;
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  constructor(service: CatalogueVehiclesService) {
    this._brands = signal([]);
    effect(() => {
      service
        .fetchBrands()
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (data: CatalogueBrand[]): void => {
            this._brands.set(data);
          },
        });
    });
  }

  public selectedBrand: CatalogueBrand | undefined;

  public get brands(): CatalogueBrand[] {
    return this._brands();
  }

  public onChange($event: SelectChangeEvent): void {
    const brand: CatalogueBrand | null = $event.value as CatalogueBrand;
    if (brand) {
      this.onBrandChange.emit(brand.id);
      return;
    }
    this.onBrandChange.emit(undefined);
  }
}
