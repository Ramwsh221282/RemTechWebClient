import { SpareParserLink } from './spare-parser-link';

export type SpareParser = {
  name: string;
  state: string;
  lastRun: Date;
  nextRun: Date;
  waitDays: number;
  links: SpareParserLink[];
};
