export type SpareParserUpdateDetails = {
  name: string;
  stateUpdate?: SpareParserUpdateStateDetails | null;
  scheduleUpdate?: SpareParserUpdateScheduleDetails | null;
};

export type SpareParserUpdateStateDetails = {
  state: string;
};

export type SpareParserUpdateScheduleDetails = {
  lastRun: Date;
  nextRun: Date;
  waitDays: number;
};
