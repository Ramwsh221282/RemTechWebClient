import { Observable } from 'rxjs';
import { VehicleKind } from '../types/vehiclekind';

export interface VehicleKindSource {
  retrieve(): Observable<VehicleKind[]>;
}
