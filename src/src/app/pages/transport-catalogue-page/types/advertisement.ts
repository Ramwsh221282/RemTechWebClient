export type Advertisement = {
  id: string;
  brandId: string;
  categoryId: string;
  title: string;
  description: string;
  priceValue: number;
  priceExtra: string;
  sourceUrl: string;
  geoName: string;
  characteristics: AdvertisementCharacteristic[];
  photos: AdvertisementPhotos[];
};

export type AdvertisementCharacteristic = {
  name: string;
  value: string;
};

export type AdvertisementPhotos = {
  sourceUrl: string;
};

export class AdvertisementsFactory {
  public static empty(): Advertisement {
    return {
      id: '',
      brandId: '',
      categoryId: '',
      title: '',
      description: '',
      priceValue: 0,
      priceExtra: '',
      sourceUrl: '',
      geoName: '',
      characteristics: [],
      photos: [],
    };
  }
}
