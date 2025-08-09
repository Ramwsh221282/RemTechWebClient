import {
  Component,
  effect,
  EventEmitter,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { Button } from 'primeng/button';
import { Toolbar } from 'primeng/toolbar';
import { Badge } from 'primeng/badge';
import { Panel } from 'primeng/panel';
import { VehicleBrand } from '../../data/types/vehiclebrands';
import { VehicleKind } from '../../data/types/vehiclekind';

@Component({
  selector: 'app-vehicles-catalogue-selection-bar',
  imports: [Button, Toolbar, Badge, Panel],
  templateUrl: './vehicles-catalogue-selection-bar.component.html',
  styleUrl: './vehicles-catalogue-selection-bar.component.scss',
})
export class VehiclesCatalogueSelectionBarComponent {
  @Output() goToCatalogueClicked: EventEmitter<void> = new EventEmitter();

  @Input({ required: true }) set kind_setter(value: VehicleKind | null) {
    this._kind.set(value);
  }

  @Input({ required: true }) set brand_setter(value: VehicleBrand | null) {
    this._brand.set(value);
  }

  private readonly _severity: WritableSignal<
    | 'info'
    | 'success'
    | 'warn'
    | 'danger'
    | 'secondary'
    | 'contrast'
    | 'help'
    | 'primary'
    | null
    | undefined
  >;
  private readonly _brand: WritableSignal<VehicleBrand | null>;
  private readonly _kind: WritableSignal<VehicleKind | null>;
  private readonly _buttonAvailability: WritableSignal<boolean>;
  private readonly _kindName: WritableSignal<string>;
  private readonly _brandName: WritableSignal<string>;

  constructor() {
    this._severity = signal('danger');
    this._brand = signal(null);
    this._kind = signal(null);
    this._kindName = signal('');
    this._brandName = signal('');
    this._buttonAvailability = signal(false);
    effect(() => {
      const brand: VehicleBrand | null = this._brand();
      const kind: VehicleKind | null = this._kind();
      if (!brand || !kind) {
        this._severity.set('danger');
        this._buttonAvailability.set(false);
        return;
      }

      this._severity.set('success');
      this._buttonAvailability.set(true);
    });
    effect(() => {
      const brand: VehicleBrand | null = this._brand();
      if (!brand) {
        this._brandName.set('Марка не выбрана');
        return;
      }
      this._brandName.set(brand.name);
    });
    effect(() => {
      const kind: VehicleKind | null = this._kind();
      if (!kind) {
        this._kindName.set('Тип техники не выбран');
        return;
      }
      this._kindName.set(kind.name);
    });
  }
  public get buttonSeverity():
    | 'info'
    | 'success'
    | 'warn'
    | 'danger'
    | 'secondary'
    | 'contrast'
    | 'help'
    | 'primary'
    | null
    | undefined {
    return this._severity();
  }

  public get kindName(): string {
    return this._kindName();
  }

  public get brandName(): string {
    return this._brandName();
  }

  public get buttonAvailability(): boolean {
    return this._buttonAvailability();
  }

  public goToCatalogue(): void {
    this.goToCatalogueClicked.emit();
  }
}
