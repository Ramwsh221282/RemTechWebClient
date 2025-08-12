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
import { CatalogueCategory } from '../../types/CatalogueCategory';
import { CatalogueVehiclesService } from '../../services/CatalogueVehiclesService';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Select, SelectChangeEvent } from 'primeng/select';
import { CatalogueModel } from '../../types/CatalogueModel';

@Component({
  selector: 'app-vehicle-model-filter-form-part',
  imports: [FormsModule, Select],
  templateUrl: './vehicle-model-filter-form-part.component.html',
  styleUrl: './vehicle-model-filter-form-part.component.scss',
})
export class VehicleModelFilterFormPartComponent {
  @Output() onModelSelect: EventEmitter<string | undefined> =
    new EventEmitter();
  private readonly _models: WritableSignal<CatalogueModel[]>;
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  constructor(service: CatalogueVehiclesService) {
    this._models = signal([]);
    effect(() => {
      service
        .fetchModels()
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: (data: CatalogueModel[]): void => {
            this._models.set(data);
          },
        });
    });
  }

  public selectedModel: CatalogueModel | undefined;

  public get models(): CatalogueModel[] {
    return this._models();
  }

  public onChange($event: SelectChangeEvent): void {
    const model: CatalogueModel | null = $event.value as CatalogueModel;
    if (model) {
      this.onModelSelect.emit(model.id);
      return;
    }
    this.onModelSelect.emit(undefined);
  }
}
