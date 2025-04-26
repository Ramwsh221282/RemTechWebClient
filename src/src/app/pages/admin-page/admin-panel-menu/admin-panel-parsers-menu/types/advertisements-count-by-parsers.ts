export type AdvertisementsCountByParsers = {
  parserName: string;
  advertisementsCount: number;
};

export class AdvertisementsCountByParsersFactory {
  public static default(): AdvertisementsCountByParsers {
    return { parserName: '', advertisementsCount: 0 };
  }
}
