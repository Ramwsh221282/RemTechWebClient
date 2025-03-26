export type Advertisement = {
  id: number;
  title: string;
  description: string;
  address: string;
  serviceName: string;
  sourceUrl: string;
  price: number;
  priceExtra: string;
  photos: string[];
  characteristics: AdvertisementCharacteristic[];
};

export type AdvertisementCharacteristic = {
  name: string;
  value: string;
};

export type AdvertisementResponse = {
  items: Advertisement[];
  count: number;
};

export type CharacteristicResponse = {
  name: string;
};
