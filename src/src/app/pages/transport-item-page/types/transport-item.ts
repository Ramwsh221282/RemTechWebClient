export type TransportItem = {
  id: number;
  priceExtra: string;
  priceValue: number;
  publishedBy: string;
  scraperName: string;
  sourceUrl: string;
  description: string;
  title: string;
  address: string;
  characteristics: TransportItemCharacteristic[];
  photos: TransportItemPhoto[];
};

export type TransportItemCharacteristic = {
  name: string;
  value: string;
};

export type TransportItemPhoto = {
  sourceUrl: string;
};

export class TransportItemFactory {
  public static empty(): TransportItem {
    const characteristics: TransportItemCharacteristic[] = [];
    const photos: TransportItemPhoto[] = [];
    return {
      id: -1,
      priceExtra: '',
      priceValue: -1,
      publishedBy: '',
      scraperName: '',
      sourceUrl: '',
      description: '',
      title: '',
      address: '',
      characteristics: [],
      photos: [],
    };
  }
}
