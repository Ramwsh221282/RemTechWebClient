export type ParserProfile = {
  id: string;
  parserId: string;
  name: string;
  link: string;
  lastNewAdvertisementsCount: number;
  elapsedHours: number;
  elapsedMinutes: number;
  elapsedSeconds: number;
  totalElapsedSeconds: number;
};

export class ParserProfileFactory {
  public static empty(): ParserProfile {
    return {
      id: '',
      parserId: '',
      name: '',
      link: '',
      lastNewAdvertisementsCount: 0,
      elapsedHours: 0,
      elapsedMinutes: 0,
      elapsedSeconds: 0,
      totalElapsedSeconds: 0,
    };
  }
}
