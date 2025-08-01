import {
  VehiclesCatalogueQuery,
  VehiclesCatalogueQueryWithCharacteristics,
  VehiclesCatalogueQueryWithLocation,
  VehiclesCatalogueQueryWithPrice,
  VehiclesCatalogueQueryWithSortOrder,
} from '../Query/VehiclesCatalogueQuery';

export class VehiclesCatalogueQuerySortOrder {
  private readonly _order: string | null;

  constructor(order: string | null) {
    this._order = order;
  }

  public addTo(query: VehiclesCatalogueQuery): VehiclesCatalogueQuery {
    return new VehiclesCatalogueQueryWithSortOrder(query, this);
  }

  public print(): object | null {
    return this._order === null ? null : { order: this._order };
  }
}

export class VehiclesCatalogueQueryLocationId {
  private readonly _locationId: string | null;

  constructor(locationId: string | null) {
    this._locationId = locationId;
  }

  public addTo(query: VehiclesCatalogueQuery): VehiclesCatalogueQuery {
    return new VehiclesCatalogueQueryWithLocation(query, this);
  }

  public print(): object | null {
    return this._locationId === null ? null : { id: this._locationId };
  }
}

export class VehiclesCatalogueQueryPriceSpecification {
  private readonly _isNds: boolean | null;
  private readonly _startFrom: number | null;
  private readonly _endAt: number | null;

  constructor(
    isNds: boolean | null,
    startFrom: number | null,
    endAt: number | null,
  ) {
    this._isNds = isNds;
    this._startFrom = startFrom;
    this._endAt = endAt;
  }

  public addTo(query: VehiclesCatalogueQuery): VehiclesCatalogueQuery {
    return new VehiclesCatalogueQueryWithPrice(query, this);
  }

  public print(): object | null {
    if (!this._isNds && !this._startFrom && !this._endAt) return null;
    return {
      isNds: this._isNds === null ? null : this._isNds,
      priceFrom: this._startFrom === null ? null : this._startFrom,
      priceTo: this._endAt === null ? null : this._endAt,
    };
  }
}

export class VehiclesCatalogueQueryCharacteristicsList {
  private readonly _characteristics: VehiclesCatalogueQueryCharacteristic[];

  constructor(characteristics: VehiclesCatalogueQueryCharacteristic[]) {
    this._characteristics = characteristics;
  }

  public addTo(query: VehiclesCatalogueQuery): VehiclesCatalogueQuery {
    return new VehiclesCatalogueQueryWithCharacteristics(query, this);
  }

  public accept(
    characteristic: VehiclesCatalogueQueryCharacteristic,
  ): VehiclesCatalogueQueryCharacteristicsList {
    const id: string = characteristic.id;
    const indexOfExisting: number = this._characteristics.findIndex(
      (item: VehiclesCatalogueQueryCharacteristic): boolean => item.id === id,
    );
    if (indexOfExisting > -1) {
      this._characteristics[indexOfExisting] = characteristic;
      return this;
    }

    return new VehiclesCatalogueQueryCharacteristicsList([
      ...this._characteristics,
      characteristic,
    ]);
  }

  public print(): object | null {
    if (this._characteristics.length === 0) return null;
    return {
      arguments: this._characteristics.map(
        (c: VehiclesCatalogueQueryCharacteristic) => c.print(),
      ),
    };
  }
}

export class VehiclesCatalogueQueryCharacteristic {
  private readonly _id: string;
  private readonly _value: string;
  private readonly _name: string;

  constructor(id: string, name: string, value: string) {
    this._id = id;
    this._value = value;
    this._name = name;
  }

  public get id(): string {
    return this._id;
  }

  public addTo(
    list: VehiclesCatalogueQueryCharacteristicsList,
  ): VehiclesCatalogueQueryCharacteristicsList {
    return list.accept(this);
  }

  public print(): object {
    return { id: this._id, name: this._name, value: this._value };
  }
}
