import { ParserProfile } from './parser-profile';

export type Parser = {
  id: string;
  name: string;
  state: string;
  lastRun: Date;
  nextRun: Date;
  waitDays: number;
  links: ParserProfile[];
  lastNewAdvertisementsCount: number;
};

export type ParserUpdateData = {
  id: string;
  state?: string | null;
  waitDays?: number | null;
};

export class ParserFactory {
  public static empty(): Parser {
    return {
      id: '',
      name: '',
      state: '',
      lastRun: new Date(1970, 0, 0, 0),
      nextRun: new Date(1970, 0, 0, 0),
      waitDays: 0,
      links: [],
      lastNewAdvertisementsCount: 0,
    };
  }
}
