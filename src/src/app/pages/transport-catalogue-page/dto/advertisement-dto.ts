export type AdvertisementDto = {
  title: string | null;
  description: string | null;
  price: number | null;
  priceExtra: string | null;
  serviceName: string | null;
  sourceUrl: string | null;
  publisher: string | null;
  address: string | null;
  createdAt: Date | null;
  advertisementDate: Date | null;
  characteristics: AdvertisementCharacteristicDto[] | null;
};

export type AdvertisementCharacteristicDto = {
  name: string;
  value: string;
};

export const createEmptyAdvertisementDto = (): AdvertisementDto => {
  return {
    title: null,
    description: null,
    price: null,
    priceExtra: null,
    serviceName: null,
    sourceUrl: null,
    publisher: null,
    address: null,
    createdAt: null,
    advertisementDate: null,
    characteristics: null,
  };
};
