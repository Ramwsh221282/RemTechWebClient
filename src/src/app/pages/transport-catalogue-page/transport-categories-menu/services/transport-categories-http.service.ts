import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { advertisementsApi } from '../../../../shared/api/api-endpoint';
import { Envelope } from '../../../../shared/types/Envelope';
import { TransportCategory } from '../types/TransportCategory';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransportCategoriesHttpService {
  private readonly _httpClient: HttpClient;
  private readonly _apiUrl: string;

  public constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
    this._apiUrl = `${advertisementsApi}/transport-categories`;
  }

  public fetchCategories(): Observable<Envelope<TransportCategory[]>> {
    return this._httpClient.get<Envelope<TransportCategory[]>>(this._apiUrl);
  }

  public fetchById(id: string): Observable<Envelope<TransportCategory>> {
    return this._httpClient.get<Envelope<TransportCategory>>(
      `${this._apiUrl}/${id}`,
    );
  }
}
