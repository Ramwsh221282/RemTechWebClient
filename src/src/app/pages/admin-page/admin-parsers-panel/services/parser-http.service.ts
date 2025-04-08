import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {apiUrl} from '../../../../shared/api/api-endpoint';
import {ParserProfile} from '../../types/parser-profile';
import {Parser} from '../../types/parser';
import {Observable} from 'rxjs';
import {Envelope} from '../../../../shared/types/Envelope';

@Injectable({
  providedIn: 'root'
})
export class ParserHttpService {
  private readonly _client: HttpClient = inject(HttpClient);
  private readonly _apiUrl: string = `${apiUrl}/parsers`;

  public updateProfile(original: ParserProfile, parser: Parser, updated: ParserProfile): Observable<Envelope<string>> {
    const profileName: string = original.name;
    const parserName: string = parser.name;

    const body: object = {
      profileName: updated.name,
      profileState: updated.state,
      links: updated.links,
      schedule: {
        repeatEveryHours: updated.repeatEveryHours,
      }
    }

    return this._client.patch<Envelope<string>>(`${this._apiUrl}/${parserName}/${profileName}`, body);
  }

  public fetchParsers(): Observable<Envelope<Parser[]>> {
    return this._client.get<Envelope<Parser[]>>(this._apiUrl);
  }

  public createNewProfile(parser: Parser, profileName: string): Observable<Envelope<ParserProfile>> {
    const parserName: string = parser.name;
    return this._client.post<Envelope<ParserProfile>>(`${this._apiUrl}/${parserName}/${profileName}`, null);
  }

  public deleteProfile(parser: Parser, profile: ParserProfile): Observable<Envelope<string>> {
    const parserName: string = parser.name;
    const profileName: string = profile.name;
    return this._client.delete<Envelope<string>>(`${this._apiUrl}/${parserName}/${profileName}`);
  }
}
