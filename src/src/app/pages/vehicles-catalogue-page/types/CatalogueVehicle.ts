export interface CatalogueVehicle {
  brand: CatalogueVehicleBrand;
  characteristics: CatalogueVehicleCharacteristics;
  identity: CatalogueVehicleIdentity;
  kind: CatalogueVehicleKind;
  model: CatalogueVehicleModel;
  photos: CatalogueVehiclePhotos;
  price: CatalogueVehiclePrice;
  region: CatalogueVehicleRegion;
}

export interface CatalogueVehicleIdentity {
  id: string;
}

export interface CatalogueVehicleKind {
  id: string;
  name: string;
}

export interface CatalogueVehicleBrand {
  id: string;
  name: string;
}

export interface CatalogueVehicleModel {
  id: string;
  name: string;
}

export interface CatalogueVehicleRegion {
  id: string;
  name: string;
  kind: string;
}

export interface CatalogueVehiclePrice {
  price: number;
  isNds: boolean;
}

export interface CatalogueVehiclePhotos {
  photos: CatalogueVehiclePhoto[];
}

export interface CatalogueVehiclePhoto {
  source: string;
}

export interface CatalogueVehicleCharacteristics {
  characteristics: CatalogueVehicleCharacteristic[];
}

export interface CatalogueVehicleCharacteristic {
  vehicleId: string;
  characteristicId: string;
  name: string;
  value: string;
  measure: string;
}
