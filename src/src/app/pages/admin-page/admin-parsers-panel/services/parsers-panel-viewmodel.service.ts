import {Injectable, signal, WritableSignal} from '@angular/core';
import {Parser, ParserFactory} from '../../types/parser';
import {ParserProfile} from '../../types/parser-profile';
import {ArrayUtils} from '../../../../shared/utils/array-utils';

@Injectable({
  providedIn: 'any'
})
export class ParserPanelViewModel {
  private readonly _parsers: WritableSignal<Parser[]> = signal([]);
  private readonly _selectedParser: WritableSignal<Parser | null> = signal(null);
  private readonly _selectedProfile: WritableSignal<ParserProfile | null> = signal(null);

  public get selectedParser(): Parser | null {
    return this._selectedParser();
  }

  public get selectedProfile(): ParserProfile | null {
    return this._selectedProfile();
  }

  public get parsers(): Parser[] {
    return this._parsers();
  }

  public set parsers(value: Parser[]) {
    this._parsers.set(value);
  }

  public set selectedParser(value: Parser) {
    this._selectedParser.set(value);
    this.selectedProfile = null;
  }

  public set selectedProfile(value: ParserProfile | null) {
    this._selectedProfile.set(value);
  }

  public updateProfile(updatedProfile: ParserProfile): void {
    const currentProfile: ParserProfile | null = this._selectedProfile();
    const currentParser: Parser | null = this._selectedParser();
    if (!currentProfile) return;
    if (!currentParser) return;

    this._selectedProfile.set(updatedProfile);
    const updatedProfiles: ParserProfile[] = ArrayUtils
      .updateItemByIndex(updatedProfile, currentParser.profiles, (arg: ParserProfile) => arg.id === updatedProfile.id);
    const updatedParser: Parser = ParserFactory.updated(currentParser, { profiles: updatedProfiles });

    this.updateParsers(updatedParser);
  }

  public addProfile(profile: ParserProfile): void {
    const currentParser: Parser | null = this._selectedParser();
    if (!currentParser) return;

    const parserProfiles: ParserProfile[] = [profile, ...currentParser.profiles];
    const updatedParser: Parser = ParserFactory.updated(currentParser, { profiles: parserProfiles });

    this.updateParsers(updatedParser);
  }

  public removeProfile(profile: ParserProfile): void {
    const currentParser: Parser | null = this._selectedParser();
    if (!currentParser) return;

    const updatedParserProfiles: ParserProfile[] = ArrayUtils
      .removeItem(currentParser.profiles, item => item.id === profile.id);
    const updatedParser: Parser = ParserFactory.updated(currentParser, { profiles: updatedParserProfiles });

    this.updateParsers(updatedParser);
  }

  private updateParsers(updatedParser: Parser): void {
    const parsers: Parser[] = this._parsers();
    const updatedParsers: Parser[] = ArrayUtils.updateItemByIndex(updatedParser, parsers, arg => arg.id === updatedParser.id);
    this._selectedParser.update((_) => updatedParser);
    this._parsers.update((_) => updatedParsers);
  }
}
