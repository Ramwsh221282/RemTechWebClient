import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {apiUrl} from '../../../shared/api/api-endpoint';
import {Observable} from 'rxjs';
import {Envelope} from '../../../shared/types/Envelope';
import {TransportCharacteristic} from '../types/transport-characteristic';

@Injectable({
  providedIn: 'root'
})
export class TransportCharacteristicsHttpService {
  private readonly _httpClient: HttpClient;
  private readonly _apiUrl: string;

  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
    this._apiUrl = `${apiUrl}/characteristics`
  }

  public fetchCharacteristics(): Observable<Envelope<TransportCharacteristic[]>> {
    return this._httpClient.get<Envelope<TransportCharacteristic[]>>(this._apiUrl);
  }
}
