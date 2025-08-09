import { Observable } from 'rxjs';
import { VehiclesAggregatedData } from '../../types/VehiclesAggregatedData';
import { HttpClient } from '@angular/common/http';
import {
  VehicleModelQueryArgument,
  VehiclesCatalogueQueryCharacteristicsList,
  VehiclesCatalogueQueryLocationId,
  VehiclesCatalogueQueryPriceSpecification,
} from '../QueryArguments/QueryArguments';
import { apiUrl } from '../../../../shared/api/api-endpoint';

export interface VehiclesAggregatedDataQuery {
  query(
    kindId: string,
    brandId: string,
    httpClient: HttpClient,
  ): Observable<VehiclesAggregatedData>;
  bodyObject(): object;
}

export class VehiclesAggregatedDataCharacteristicsChangedQuery
  implements VehiclesAggregatedDataQuery
{
  private readonly _query: VehiclesAggregatedDataQuery;
  private readonly _characteristics: VehiclesCatalogueQueryCharacteristicsList;

  constructor(
    characteristics: VehiclesCatalogueQueryCharacteristicsList,
    query: VehiclesAggregatedDataQuery,
  ) {
    this._query = query;
    this._characteristics = characteristics;
  }

  bodyObject(): object {
    return {
      ...this._query.bodyObject(),
      characteristics: this._characteristics.print(),
    };
  }

  query(
    kindId: string,
    brandId: string,
    httpClient: HttpClient,
  ): Observable<VehiclesAggregatedData> {
    const url = `${apiUrl}/vehicles/kinds/${kindId}/brands/${brandId}/catalogue/aggregated`;
    const body: object = this.bodyObject();
    return httpClient.post<VehiclesAggregatedData>(url, body);
  }
}

export class VehiclesAggregatedDataRegionChangedQuery
  implements VehiclesAggregatedDataQuery
{
  private readonly _origin: VehiclesAggregatedDataQuery;
  private readonly _region: VehiclesCatalogueQueryLocationId;
  constructor(
    region: VehiclesCatalogueQueryLocationId,
    origin: VehiclesAggregatedDataQuery,
  ) {
    this._origin = origin;
    this._region = region;
  }

  bodyObject(): object {
    return {
      ...this._origin.bodyObject(),
      regionId: this._region.print(),
    };
  }

  query(
    kindId: string,
    brandId: string,
    httpClient: HttpClient,
  ): Observable<VehiclesAggregatedData> {
    const url = `${apiUrl}/vehicles/kinds/${kindId}/brands/${brandId}/catalogue/aggregated`;
    const body: object = this.bodyObject();
    return httpClient.post<VehiclesAggregatedData>(url, body);
  }
}

export class VehiclesAggregatedDataPriceChangedQuery
  implements VehiclesAggregatedDataQuery
{
  private readonly _origin: VehiclesAggregatedDataQuery;
  private readonly _price: VehiclesCatalogueQueryPriceSpecification;
  constructor(
    price: VehiclesCatalogueQueryPriceSpecification,
    origin: VehiclesAggregatedDataQuery,
  ) {
    this._origin = origin;
    this._price = price;
  }

  bodyObject(): object {
    return {
      ...this._origin.bodyObject(),
      price: this._price.print(),
    };
  }

  query(
    kindId: string,
    brandId: string,
    httpClient: HttpClient,
  ): Observable<VehiclesAggregatedData> {
    const url = `${apiUrl}/vehicles/kinds/${kindId}/brands/${brandId}/catalogue/aggregated`;
    const body: object = this.bodyObject();
    return httpClient.post<VehiclesAggregatedData>(url, body);
  }
}

export class VehiclesAggregatedDataModelChangedQuery
  implements VehiclesAggregatedDataQuery
{
  private readonly _argument: VehicleModelQueryArgument;
  private readonly _origin: VehiclesAggregatedDataQuery;
  constructor(
    argument: VehicleModelQueryArgument,
    origin: VehiclesAggregatedDataQuery,
  ) {
    this._argument = argument;
    this._origin = origin;
  }

  bodyObject(): object {
    return {
      ...this._origin.bodyObject(),
      modelId: this._argument.print(),
    };
  }

  query(
    kindId: string,
    brandId: string,
    httpClient: HttpClient,
  ): Observable<VehiclesAggregatedData> {
    const url = `${apiUrl}/vehicles/kinds/${kindId}/brands/${brandId}/catalogue/aggregated`;
    const body: object = this.bodyObject();
    return httpClient.post<VehiclesAggregatedData>(url, body);
  }
}

export class VehiclesAggregatedDataBrandChangedQuery
  implements VehiclesAggregatedDataQuery
{
  private readonly _brandId: string;

  constructor(brandId: string) {
    this._brandId = brandId;
  }

  bodyObject(): object {
    return {
      brandId: { id: this._brandId },
    };
  }

  query(
    kindId: string,
    brandId: string,
    httpClient: HttpClient,
  ): Observable<VehiclesAggregatedData> {
    const url = `${apiUrl}/vehicles/kinds/${kindId}/brands/${brandId}/catalogue/aggregated`;
    const body: object = this.bodyObject();
    return httpClient.post<VehiclesAggregatedData>(url, body);
  }
}

export class VehiclesAggregatedDataKindChangedQuery
  implements VehiclesAggregatedDataQuery
{
  private readonly _kindId: string;
  private readonly _origin: VehiclesAggregatedDataQuery;

  constructor(kindId: string, origin: VehiclesAggregatedDataQuery) {
    this._kindId = kindId;
    this._origin = origin;
  }

  bodyObject(): object {
    return {
      ...this._origin.bodyObject(),
      kindId: { id: this._kindId },
    };
  }

  query(
    kindId: string,
    brandId: string,
    httpClient: HttpClient,
  ): Observable<VehiclesAggregatedData> {
    const url = `${apiUrl}/vehicles/kinds/${kindId}/brands/${brandId}/catalogue/aggregated`;
    const body: object = this.bodyObject();
    return httpClient.post<VehiclesAggregatedData>(url, body);
  }
}

export class VehiclesAggregatedDataBasicQuery
  implements VehiclesAggregatedDataQuery
{
  private readonly _kindId: string;
  private readonly _brandId: string;
  constructor(kindId: string, brandId: string) {
    this._kindId = kindId;
    this._brandId = brandId;
  }

  query(
    kindId: string,
    brandId: string,
    httpClient: HttpClient,
  ): Observable<VehiclesAggregatedData> {
    const url = `${apiUrl}/vehicles/kinds/${kindId}/brands/${brandId}/catalogue/aggregated`;
    const body: object = this.bodyObject();
    return httpClient.post<VehiclesAggregatedData>(url, body);
  }

  bodyObject(): object {
    return {
      kindId: { id: this._kindId },
      brandId: { id: this._brandId },
    };
  }

  public static default(): VehiclesAggregatedDataBasicQuery {
    return new VehiclesAggregatedDataBasicQuery('', '');
  }
}
