export type ParserProfile = {
  id: string;
  name: string;
  state: string;
  repeatEveryHours: number;
  links: string[]
}

export type ParserProfileUpdateData = {
  name?: string | null,
  state?: string | null,
  repeatEveryHours?: number | null,
  links?: string[] | null,
}

export class ParserProfileFactory {
  public static empty(): ParserProfile {
    return { name: '', id: '', links: [], repeatEveryHours: 0, state: '' }
  }

  public static new(id: string, name: string): ParserProfile {
    const profile: ParserProfile = this.empty();
    profile.id = id;
    profile.state = 'Отключен';
    profile.name = name;
    return profile;
  }

  public static updated(
    original: ParserProfile,
    data: ParserProfileUpdateData
  ): ParserProfile {
    const copy = { ...original };
    if (data.name) copy.name = data.name;
    if (data.state) copy.state = data.state;
    if (data.links) copy.links = data.links;
    if (data.repeatEveryHours) copy.repeatEveryHours = data.repeatEveryHours;
    return copy;
  }
}
