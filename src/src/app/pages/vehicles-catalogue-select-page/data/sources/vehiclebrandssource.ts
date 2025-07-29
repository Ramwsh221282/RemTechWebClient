import { VehicleBrand } from '../types/vehiclebrands';
import { Observable } from 'rxjs';
import { VehicleKind } from '../types/vehiclekind';

export interface VehicleBrandsSource {
  retrieve(kind: VehicleKind): Observable<VehicleBrand[]>;
}
