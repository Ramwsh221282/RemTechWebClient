import { Component, effect, signal, WritableSignal } from '@angular/core';
import { VehicleKindsSelectPagePanelComponent } from './components/vehicle-kinds-select-page-panel/vehicle-kinds-select-page-panel.component';
import { VehicleKind } from './data/types/vehiclekind';
import { VehicleBrand } from './data/types/vehiclebrands';
import { VehicleBrandsSelectPagePanelComponent } from './components/vehicle-brands-select-page-panel/vehicle-brands-select-page-panel.component';
import { NgIf } from '@angular/common';
import { VehicleModelsSelectPagePanelComponent } from './components/vehicle-models-select-page-panel/vehicle-models-select-page-panel.component';
import { VehicleModel } from './data/types/vehiclemodel';
import { GoToVehicleCatalogueDialogComponent } from './components/go-to-vehicle-catalogue-dialog/go-to-vehicle-catalogue-dialog.component';
import { Drawer } from 'primeng/drawer';
import { Toolbar } from 'primeng/toolbar';
import { Button } from 'primeng/button';
import { VehiclesCatalogueSelectionBarComponent } from './components/vehicles-catalogue-selection-bar/vehicles-catalogue-selection-bar.component';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MessageServiceUtils } from '../../shared/utils/message-service-utils';
import { AdaptiveToastComponent } from '../../shared/components/adaptive-toast/adaptive-toast.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicles-catalogue-select-page',
  imports: [
    VehicleKindsSelectPagePanelComponent,
    VehicleBrandsSelectPagePanelComponent,
    NgIf,
    VehicleModelsSelectPagePanelComponent,
    GoToVehicleCatalogueDialogComponent,
    VehiclesCatalogueSelectionBarComponent,
    AdaptiveToastComponent,
  ],
  providers: [MessageService],
  templateUrl: './vehicles-catalogue-select-page.component.html',
  styleUrl: './vehicles-catalogue-select-page.component.scss',
})
export class VehiclesCatalogueSelectPageComponent {
  private readonly _selectedVehicleKind: WritableSignal<VehicleKind | null>;
  private readonly _selectedVehicleBrand: WritableSignal<VehicleBrand | null>;
  private readonly _selectedVehicleModel: WritableSignal<VehicleModel | null>;
  private readonly _shouldOpenGoToCatalogueSelectDialog: WritableSignal<boolean>;
  private readonly _wasDialogDisplayed: WritableSignal<boolean>;
  private readonly _messageService: MessageService;
  private readonly _router: Router;

  constructor(messageService: MessageService, router: Router) {
    this._router = router;
    this._selectedVehicleKind = signal(null);
    this._selectedVehicleBrand = signal(null);
    this._selectedVehicleModel = signal(null);
    this._wasDialogDisplayed = signal(false);
    this._messageService = messageService;
    this._shouldOpenGoToCatalogueSelectDialog = signal(false);
    effect(() => {
      const kind: VehicleKind | null = this._selectedVehicleKind();
      const brand: VehicleBrand | null = this._selectedVehicleBrand();
      const model: VehicleModel | null = this._selectedVehicleModel();
      if (!kind || !brand || !model) {
        this._shouldOpenGoToCatalogueSelectDialog.set(false);
        return;
      }

      const wasItemDisplayed: boolean = this._wasDialogDisplayed();
      if (!wasItemDisplayed) {
        this._shouldOpenGoToCatalogueSelectDialog.set(true);
        this._wasDialogDisplayed.set(true);
      }
    });
  }

  public get kindSelected(): boolean {
    return this._selectedVehicleKind() !== null;
  }

  public get brandSelected(): boolean {
    return this._selectedVehicleBrand() !== null;
  }

  public get currentBrand(): VehicleBrand {
    const brand: VehicleBrand | null = this._selectedVehicleBrand();
    return brand!;
  }

  public get shouldOpenGoToCatalogueSelectDialog(): boolean {
    return this._shouldOpenGoToCatalogueSelectDialog();
  }

  public get currentKind(): VehicleKind {
    const kind: VehicleKind | null = this._selectedVehicleKind();
    return kind!;
  }

  public get currentModel(): VehicleModel {
    const model: VehicleModel | null = this._selectedVehicleModel();
    return model!;
  }

  public acceptChangeParametersClick(): void {
    this._shouldOpenGoToCatalogueSelectDialog.set(false);
  }

  public acceptSelectedVehicleBrand(brand: VehicleBrand): void {
    const currentModel: VehicleModel | null = this._selectedVehicleModel();
    if (currentModel) {
      this._selectedVehicleModel.set(null);
    }
    this._selectedVehicleBrand.set(brand);
    MessageServiceUtils.showInfo(this._messageService, `Марка ${brand.name}`);
  }

  public acceptSelectedVehicleKind(vehicleKind: VehicleKind): void {
    const currentKind: VehicleKind | null = this._selectedVehicleKind();
    if (currentKind) {
      this._selectedVehicleBrand.set(null);
      this._selectedVehicleModel.set(null);
    }
    this._selectedVehicleKind.set(vehicleKind);
    MessageServiceUtils.showInfo(
      this._messageService,
      `Тип техники: ${vehicleKind.name}`,
    );
  }

  public acceptSelectedVehicleModel(vehicleModel: VehicleModel): void {
    this._selectedVehicleModel.set(vehicleModel);
    MessageServiceUtils.showInfo(
      this._messageService,
      `Модель: ${vehicleModel.name}`,
    );
  }

  public navigateToCatalogue(): void {
    const currentBrand: VehicleBrand | null = this._selectedVehicleBrand();
    const currentModel: VehicleModel | null = this._selectedVehicleModel();
    const currentKind: VehicleKind | null = this._selectedVehicleKind();
    if (!currentModel || !currentKind || !currentBrand) {
      return;
    }
    this._router.navigate([
      '/vehicles',
      'kinds',
      currentKind.id,
      'brands',
      currentBrand.id,
      'models',
      currentModel.id,
      'catalogue',
    ]);
  }
}
