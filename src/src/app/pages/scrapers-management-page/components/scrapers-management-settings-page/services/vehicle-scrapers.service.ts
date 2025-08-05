import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../../../../shared/api/api-endpoint';
import { Scraper } from '../types/Scraper';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VehicleScrapersService {
  private readonly _httpClient: HttpClient;
  private readonly _apiUrl: string;
  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
    this._apiUrl = `${apiUrl}/scrapers/vehicles`;
  }

  public fetch(): Observable<Scraper[]> {
    return this._httpClient.get<Scraper[]>(this._apiUrl);
  }

  public fetchConcrete(name: string, type: string): Observable<Scraper> {
    const requestUrl = `${this._apiUrl}/${name}/${type}`;
    return this._httpClient.get<Scraper>(requestUrl);
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
