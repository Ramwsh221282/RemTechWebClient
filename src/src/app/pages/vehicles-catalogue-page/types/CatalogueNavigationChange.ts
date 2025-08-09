import { BasicVehicleKind } from './BasicVehicleKind';
import { BasicVehicleBrand } from './BasicVehicleBrand';
import { BasicVehicleModel } from './BasicVehicleModel';

export interface CatalogueNavigationChange {
  kind: BasicVehicleKind;
  brand: BasicVehicleBrand;
}
