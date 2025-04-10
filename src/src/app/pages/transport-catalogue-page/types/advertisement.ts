export type Advertisement = {
  id: number;
  priceExtra: string;
  priceValue: number;
  publishedBy: string;
  scraperName: string;
  sourceUrl: string;
  description: string;
  title: string;
  address: string;
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
