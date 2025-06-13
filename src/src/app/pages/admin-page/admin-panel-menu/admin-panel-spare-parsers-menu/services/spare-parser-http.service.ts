import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { spareParsersApiUrl } from '../../../../../shared/api/api-endpoint';
import { Observable } from 'rxjs';
import { Envelope } from '../../../../../shared/types/Envelope';
import { SpareParser } from '../models/spare-parser-ts';

@Injectable({
  providedIn: 'root',
})
export class SpareParserHttpService {
  private readonly _httpClient: HttpClient;
  private readonly _apiUrl: string;

  constructor(httpClient: HttpClient) {
    this._apiUrl = spareParsersApiUrl;
    this._httpClient = httpClient;
  }
  
  public fetchAll(): Observable<Envelope<SpareParser[]>> {
    return this._httpClient.get<Envelope<SpareParser[]>>(this._apiUrl);
  }
}
