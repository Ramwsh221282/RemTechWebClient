import { CatalogueVehicle } from '../../types/CatalogueVehicle';
import {
  VehiclesCatalogueQueryCharacteristicsList,
  VehiclesCatalogueQueryLocationId,
  VehiclesCatalogueQueryPriceSpecification,
  VehiclesCatalogueQuerySortOrder,
  VehiclesCatalogueTextSearchQuery,
} from '../QueryArguments/QueryArguments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '../../../../shared/api/api-endpoint';

export interface VehiclesCatalogueQuery {
  bodyObject(): object;
  query(
    kindId: string,
    brandId: string,
    modelId: string,
    httpClient: HttpClient,
  ): Observable<CatalogueVehicle[]>;
}

export class VehiclesCatalogueQueryWithCharacteristics
  implements VehiclesCatalogueQuery
{
  private readonly _query: VehiclesCatalogueQuery;
  private readonly _characteristics: VehiclesCatalogueQueryCharacteristicsList;

  constructor(
    query: VehiclesCatalogueQuery,
    characteristics: VehiclesCatalogueQueryCharacteristicsList,
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

  public query(
    kindId: string,
    brandId: string,
    modelId: string,
    httpClient: HttpClient,
  ): Observable<CatalogueVehicle[]> {
    const url = `${apiUrl}/vehicles/kinds/${kindId}/brands/${brandId}/models/${modelId}/catalogue`;
    const body = this.bodyObject();
    return httpClient.post<CatalogueVehicle[]>(url, body);
  }
}

export class VehiclesCatalogueQueryWithTextSearch
  implements VehiclesCatalogueQuery
{
  private readonly _query: VehiclesCatalogueQuery;
  private readonly _search: VehiclesCatalogueTextSearchQuery;
  constructor(
    query: VehiclesCatalogueQuery,
    search: VehiclesCatalogueTextSearchQuery,
  ) {
    this._query = query;
    this._search = search;
  }

  bodyObject(): object {
    return {
      ...this._query.bodyObject(),
      text: this._search.print(),
    };
  }

  query(
    kindId: string,
    brandId: string,
    modelId: string,
    httpClient: HttpClient,
  ): Observable<CatalogueVehicle[]> {
    const url = `${apiUrl}/vehicles/kinds/${kindId}/brands/${brandId}/models/${modelId}/catalogue`;
    const body = this.bodyObject();
    return httpClient.post<CatalogueVehicle[]>(url, body);
  }
}

export class VehiclesCatalogueQueryWithPrice implements VehiclesCatalogueQuery {
  private readonly _query: VehiclesCatalogueQuery;
  private readonly _price: VehiclesCatalogueQueryPriceSpecification;

  constructor(
    query: VehiclesCatalogueQuery,
    price: VehiclesCatalogueQueryPriceSpecification,
  ) {
    this._query = query;
    this._price = price;
  }
  public query(
    kindId: string,
    brandId: string,
    modelId: string,
    httpClient: HttpClient,
  ): Observable<CatalogueVehicle[]> {
    const url = `${apiUrl}/vehicles/kinds/${kindId}/brands/${brandId}/models/${modelId}/catalogue`;
    const body = this.bodyObject();
    return httpClient.post<CatalogueVehicle[]>(url, body);
  }

  public bodyObject(): object {
    return {
      ...this._query.bodyObject(),
      price: this._price.print(),
    };
  }
}

export class VehiclesCatalogueQueryWithSortOrder
  implements VehiclesCatalogueQuery
{
  private readonly _query: VehiclesCatalogueQuery;
  private readonly _sortOrder: VehiclesCatalogueQuerySortOrder;

  constructor(
    query: VehiclesCatalogueQuery,
    sortOrder: VehiclesCatalogueQuerySortOrder,
  ) {
    this._query = query;
    this._sortOrder = sortOrder;
  }

  public bodyObject(): object {
    return {
      ...this._query.bodyObject(),
      sortOrder: this._sortOrder.print(),
    };
  }

  public query(
    kindId: string,
    brandId: string,
    modelId: string,
    httpClient: HttpClient,
  ): Observable<CatalogueVehicle[]> {
    const url = `${apiUrl}/vehicles/kinds/${kindId}/brands/${brandId}/models/${modelId}/catalogue`;
    const body = this.bodyObject();
    return httpClient.post<CatalogueVehicle[]>(url, body);
  }
}

export class VehiclesCatalogueQueryWithLocation
  implements VehiclesCatalogueQuery
{
  private readonly _query: VehiclesCatalogueQuery;
  private readonly _location: VehiclesCatalogueQueryLocationId;

  constructor(
    query: VehiclesCatalogueQuery,
    location: VehiclesCatalogueQueryLocationId,
  ) {
    this._query = query;
    this._location = location;
  }
  query(
    kindId: string,
    brandId: string,
    modelId: string,
    httpClient: HttpClient,
  ): Observable<CatalogueVehicle[]> {
    const url = `${apiUrl}/vehicles/kinds/${kindId}/brands/${brandId}/models/${modelId}/catalogue`;
    const body = this.bodyObject();
    return httpClient.post<CatalogueVehicle[]>(url, body);
  }

  public bodyObject(): object {
    return {
      ...this._query.bodyObject(),
      regionId: this._location.print(),
    };
  }
}

export class VehicleCatalogueQueryWithOtherModel
  implements VehiclesCatalogueQuery
{
  private readonly _modelId: string;
  private readonly _origin: VehiclesCatalogueQuery;
  constructor(modelId: string, origin: VehiclesCatalogueQuery) {
    this._modelId = modelId;
    this._origin = origin;
  }

  bodyObject(): object {
    return {
      ...this._origin.bodyObject(),
      modelId: { id: this._modelId },
    };
  }

  query(
    kindId: string,
    brandId: string,
    modelId: string,
    httpClient: HttpClient,
  ): Observable<CatalogueVehicle[]> {
    const url = `${apiUrl}/vehicles/kinds/${kindId}/brands/${brandId}/models/${modelId}/catalogue`;
    const body = this.bodyObject();
    return httpClient.post<CatalogueVehicle[]>(url, body);
  }
}

export class VehicleCatalogueQueryWithOtherPage
  implements VehiclesCatalogueQuery
{
  private readonly _page: number;
  private readonly _origin: VehiclesCatalogueQuery;
  constructor(page: number, origin: VehiclesCatalogueQuery) {
    this._page = page;
    this._origin = origin;
  }

  bodyObject(): object {
    return {
      ...this._origin.bodyObject(),
      pagination: { page: this._page },
    };
  }

  query(
    kindId: string,
    brandId: string,
    modelId: string,
    httpClient: HttpClient,
  ): Observable<CatalogueVehicle[]> {
    const url = `${apiUrl}/vehicles/kinds/${kindId}/brands/${brandId}/models/${modelId}/catalogue`;
    const body: object = this.bodyObject();
    return httpClient.post<CatalogueVehicle[]>(url, body);
  }
}

export class VehicleCatalogueQueryWithOtherBrand
  implements VehiclesCatalogueQuery
{
  private readonly _brandId: string;
  private readonly _origin: VehiclesCatalogueQuery;
  constructor(brandId: string, origin: VehiclesCatalogueQuery) {
    this._brandId = brandId;
    this._origin = origin;
  }

  bodyObject(): object {
    return {
      ...this._origin.bodyObject(),
      brandId: { id: this._brandId },
    };
  }

  query(
    kindId: string,
    brandId: string,
    modelId: string,
    httpClient: HttpClient,
  ): Observable<CatalogueVehicle[]> {
    const url = `${apiUrl}/vehicles/kinds/${kindId}/brands/${brandId}/models/${modelId}/catalogue`;
    const body = this.bodyObject();
    return httpClient.post<CatalogueVehicle[]>(url, body);
  }
}

export class VehicleCatalogueQueryOtherKind implements VehiclesCatalogueQuery {
  private readonly _kindId: string;
  private readonly _origin: VehiclesCatalogueQuery;
  constructor(kindId: string, origin: VehiclesCatalogueQuery) {
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
    modelId: string,
    httpClient: HttpClient,
  ): Observable<CatalogueVehicle[]> {
    const url = `${apiUrl}/vehicles/kinds/${kindId}/brands/${brandId}/models/${modelId}/catalogue`;
    const body = this.bodyObject();
    return httpClient.post<CatalogueVehicle[]>(url, body);
  }
}

export class BaseVehiclesCatalogueQuery implements VehiclesCatalogueQuery {
  private readonly _kindId: string;
  private readonly _brandId: string;
  private readonly _modelId: string;
  private readonly _currentPage: number;

  public constructor(
    kindId: string,
    brandId: string,
    modelId: string,
    currentPage: number,
  ) {
    this._kindId = kindId;
    this._brandId = brandId;
    this._modelId = modelId;
    this._currentPage = currentPage;
  }

  query(
    kindId: string,
    brandId: string,
    modelId: string,
    httpClient: HttpClient,
  ): Observable<CatalogueVehicle[]> {
    const url = `${apiUrl}/vehicles/kinds/${kindId}/brands/${brandId}/models/${modelId}/catalogue`;
    const body = this.bodyObject();
    return httpClient.post<CatalogueVehicle[]>(url, body);
  }

  public bodyObject(): object {
    return {
      kindId: { id: this._kindId },
      brandId: { id: this._brandId },
      modelId: { id: this._modelId },
      pagination: { page: this._currentPage },
    };
  }

  public static default(): BaseVehiclesCatalogueQuery {
    return new BaseVehiclesCatalogueQuery('', '', '', 0);
  }
}
