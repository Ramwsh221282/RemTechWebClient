import { Injectable } from '@angular/core';
import { apiUrl } from '../../../../../shared/api/api-endpoint';
import { HttpClient } from '@angular/common/http';
import { Envelope } from '../../../../../shared/types/Envelope';
import { ParserProfile } from '../types/parser-profile';
import { Observable } from 'rxjs';
import { Parser, ParserUpdateData } from '../types/parser';
import { AdvertisementsCountByParsers } from '../types/advertisements-count-by-parsers';

@Injectable({
  providedIn: 'root',
})
export class ParsersHttpService {
  private readonly _httpClient: HttpClient;
  private readonly _apiUrl: string;

  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
    this._apiUrl = `${apiUrl}/parsers`;
  }

  public addParserProfile(
    profile: ParserProfile,
  ): Observable<Envelope<ParserProfile>> {
    const url = `${this._apiUrl}/${profile.parserId}/${profile.name}`;
    const payload: object = {
      parserId: profile.parserId,
      profileLink: profile.link,
      profileName: profile.name,
    };
    return this._httpClient.post<Envelope<ParserProfile>>(url, payload);
  }

  public deleteParserProfile(
    profile: ParserProfile,
  ): Observable<Envelope<string>> {
    const url = `${this._apiUrl}/${profile.parserId}/${profile.id}`;
    return this._httpClient.delete<Envelope<string>>(url);
  }

  public updateParser(
    parser: Parser,
    updateData: ParserUpdateData,
  ): Observable<Envelope<string>> {
    const url = `${this._apiUrl}/${parser.id}`;
    return this._httpClient.patch<Envelope<string>>(url, updateData);
  }

  public getParserById(id: string): Observable<Envelope<Parser>> {
    const url = `${this._apiUrl}/${id}`;
    return this._httpClient.get<Envelope<Parser>>(url);
  }

  public getAllParsers(): Observable<Envelope<Parser[]>> {
    return this._httpClient.get<Envelope<Parser[]>>(this._apiUrl);
  }

  public instantlyStart(id: string): Observable<Envelope<string>> {
    const url = `${this._apiUrl}/${id}`;
    return this._httpClient.put<Envelope<string>>(url, null);
  }

  public getAdvertisementsCountByParsers(): Observable<
    Envelope<AdvertisementsCountByParsers[]>
  > {
    return this._httpClient.get<Envelope<AdvertisementsCountByParsers[]>>(
      `${this._apiUrl}/advertisements/count`,
    );
  }

  public disableAllParserLinks(parserId: string): Observable<Envelope<string>> {
    return this._httpClient.put<Envelope<string>>(
      `${this._apiUrl}/${parserId}/profiles/disabled`,
      null,
    );
  }

  public enableAllParserLinks(parserId: string): Observable<Envelope<string>> {
    return this._httpClient.put<Envelope<string>>(
      `${this._apiUrl}/${parserId}/profiles/enabled`,
      null,
    );
  }

  public updateParserLink(
    parserId: string,
    profileId: string,
    isEnabled: boolean,
  ): Observable<Envelope<ParserProfile>> {
    const body = {
      parserId: parserId,
      profileId: profileId,
      isEnabled: isEnabled,
    };
    return this._httpClient.patch<Envelope<ParserProfile>>(
      `${this._apiUrl}/${parserId}/${profileId}`,
      body,
    );
  }
}
