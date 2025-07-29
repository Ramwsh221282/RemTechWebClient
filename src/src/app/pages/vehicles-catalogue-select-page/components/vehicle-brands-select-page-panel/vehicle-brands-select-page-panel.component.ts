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
import { VehicleBrand } from '../../data/types/vehiclebrands';
import { Button } from 'primeng/button';
import { DataView } from 'primeng/dataview';
import { NgForOf } from '@angular/common';
import { Panel } from 'primeng/panel';
import { ScrollPanel } from 'primeng/scrollpanel';
import { Tag } from 'primeng/tag';
import { VehicleKind } from '../../data/types/vehiclekind';
import { VehicleBrandsSource } from '../../data/sources/vehiclebrandssource';
import { ApiVehicleBrandsSource } from '../../data/sources/apivehiclebrandssource';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-vehicle-brands-select-page-panel',
  imports: [Button, DataView, NgForOf, Panel, ScrollPanel, Tag],
  templateUrl: './vehicle-brands-select-page-panel.component.html',
  styleUrl: './vehicle-brands-select-page-panel.component.scss',
})
export class VehicleBrandsSelectPagePanelComponent {
  @Output() selectedBrand: EventEmitter<VehicleBrand> = new EventEmitter();

  @Input({ required: true }) set kind_setter(kind: VehicleKind) {
    this._kind.set(kind);
  }

  private readonly _brands: WritableSignal<VehicleBrand[]>;
  private readonly _kind: WritableSignal<VehicleKind | null>;
  private readonly _isLoading: WritableSignal<boolean>;
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  constructor(brandsSource: ApiVehicleBrandsSource) {
    this._isLoading = signal(false);
    this._brands = signal([]);
    this._kind = signal(null);
    effect(() => {
      const kind: VehicleKind | null = this._kind();
      if (!kind) {
        this._brands.set([]);
        return;
      }
      brandsSource
        .retrieve(kind)
        .pipe(
          takeUntilDestroyed(this._destroyRef),
          finalize(() => {
            this._isLoading.set(false);
          }),
        )
        .subscribe({
          next: (data: VehicleBrand[]) => this._brands.set(data),
          error: (_: HttpErrorResponse) => this._brands.set([]),
        });
    });
  }

  public get kindName(): string {
    const kind: VehicleKind | null = this._kind();
    return kind === null ? 'Категория не выбрана' : kind.name;
  }

  public get brands(): VehicleBrand[] {
    return this._brands();
  }

  public selectBrand(brand: VehicleBrand): void {
    this.selectedBrand.emit(brand);
    window.scrollTo(0, document.body.scrollHeight);
  }
}
