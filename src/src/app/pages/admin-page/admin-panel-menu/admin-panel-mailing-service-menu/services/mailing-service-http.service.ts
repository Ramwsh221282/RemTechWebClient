import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mailingServiceApiUrl } from '../../../../../shared/api/api-endpoint';
import { Observable } from 'rxjs';
import { Envelope } from '../../../../../shared/types/Envelope';
import { CreateMailingSenderDto, MailingSender } from '../types/mailing-sender';

@Injectable({
  providedIn: 'root',
})
export class MailingServiceHttpService {
  private readonly _httpClient: HttpClient;
  private readonly _apiUrl: string;

  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
    this._apiUrl = `${mailingServiceApiUrl}/mailing`;
  }

  public fetchMailingSenders(): Observable<Envelope<MailingSender[]>> {
    return this._httpClient.get<Envelope<MailingSender[]>>(this._apiUrl);
  }

  public createMailingSender(
    dto: CreateMailingSenderDto,
  ): Observable<Envelope<MailingSender>> {
    const apiUrl = `${this._apiUrl}/${dto.serviceName}`;
    return this._httpClient.post<Envelope<MailingSender>>(apiUrl, dto);
  }

  public pingMailingSender(
    sender: MailingSender,
    recepientEmail: string,
  ): Observable<Envelope<string>> {
    const apiUrl = `${this._apiUrl}/${sender.id}/${recepientEmail}/ping`;
    return this._httpClient.post<Envelope<string>>(apiUrl, null);
  }

  public updateSenderPriorities(
    identifiers: string[],
  ): Observable<Envelope<string[]>> {
    const body: object = {
      identifiers: identifiers,
    };

    const url = `${this._apiUrl}/priorities`;
    return this._httpClient.post<Envelope<string[]>>(url, body);
  }

  public turnSenderActivity(
    sender: MailingSender,
  ): Observable<Envelope<MailingSender>> {
    const url = `${this._apiUrl}/${sender.id}/activity`;
    return this._httpClient.patch<Envelope<MailingSender>>(url, null);
  }

  public removeSender(sender: MailingSender): Observable<Envelope<string>> {
    const url = `${this._apiUrl}/${sender.id}`;
    return this._httpClient.delete<Envelope<string>>(url);
  }
}
