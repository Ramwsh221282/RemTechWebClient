import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { apiUrl } from '../../../../../shared/api/api-endpoint';
import { Scraper } from '../types/Scraper';
import { Observable } from 'rxjs';
import { ParserStateToChangeRequest } from '../types/ParserStateToChangeRequest';
import { ParserStateChangeResult } from '../types/ParserStateChangedResult';
import { ParserWaitDaysUpdateRequest } from '../types/ParserWaitDaysUpdateRequest';
import { ParserWaitDaysUpdateResult } from '../types/ParserWaitDaysUpdateResult';

@Injectable({
  providedIn: 'root',
})
export class VehicleScrapersService {
  private readonly _httpClient: HttpClient;
  private readonly _apiUrl: string;
  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
    this._apiUrl = `${apiUrl}/scrapers`;
  }

  public fetch(): Observable<Scraper[]> {
    const requestUrl = `${this._apiUrl}/vehicles`;
    return this._httpClient.get<Scraper[]>(this._apiUrl);
  }

  public fetchConcrete(name: string, type: string): Observable<Scraper> {
    const requestUrl = `${this._apiUrl}/${name}/${type}`;
    return this._httpClient.get<Scraper>(requestUrl);
  }

  public changeState(
    parser: Scraper,
    request: ParserStateToChangeRequest,
  ): Observable<ParserStateChangeResult> {
    const requestUrl = `${this._apiUrl}/state`;
    let params: HttpParams = new HttpParams()
      .set('name', parser.name)
      .set('type', parser.type);
    return this._httpClient.patch<ParserStateChangeResult>(
      requestUrl,
      request,
      { params: params },
    );
  }

  public changeWaitDays(
    scraper: Scraper,
    request: ParserWaitDaysUpdateRequest,
  ): Observable<ParserWaitDaysUpdateResult> {
    const requestUrl = `${this._apiUrl}/wait-days`;
    let params: HttpParams = new HttpParams()
      .set('name', scraper.name)
      .set('type', scraper.type);
    return this._httpClient.patch<ParserWaitDaysUpdateResult>(
      requestUrl,
      request,
      { params: params },
    );
  }

  public static defaultScraper(): Scraper {
    return {
      name: '',
      domain: '',
      hours: 0,
      lastRun: new Date(),
      nextRun: new Date(),
      links: [],
      minutes: 0,
      processed: 0,
      seconds: 0,
      state: '',
      totalSeconds: 0,
      type: '',
      waitDays: 0,
    };
  }
}
