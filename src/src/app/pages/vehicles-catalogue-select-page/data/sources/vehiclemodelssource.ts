import { VehicleKind } from '../types/vehiclekind';
import { VehicleBrand } from '../types/vehiclebrands';
import { Observable } from 'rxjs';
import { VehicleModel } from '../types/vehiclemodel';

export interface VehicleModelsSource {
  retrieve(kind: VehicleKind, brand: VehicleBrand): Observable<VehicleModel[]>;
}
