import {ParserProfile} from './parser-profile';

export type Parser = {
  id: string;
  name: string;
  profiles: ParserProfile[]
}

export type ParserUpdateData = {
  name?: string | null,
  profiles?: ParserProfile[] | null;
}

export class ParserFactory {
  public static empty(): Parser {
    return {
      id: '',
      name: '',
      profiles: []
    }
  }

  public static updated(original: Parser, data: ParserUpdateData): Parser {
    const copy = {...original };
    if (data.name) copy.name = data.name;
    if (data.profiles) copy.profiles = [...data.profiles]
    return copy;
  }
}
