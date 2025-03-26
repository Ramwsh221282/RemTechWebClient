export type AdvertisementDto = {
  title?: string | null;
  description?: string | null;
  address?: string | null;
  characteristics?: AdvertisementCharacteristicDto[] | null;
};

export type AdvertisementCharacteristicDto = {
  name: string;
  value: string;
};

export const createEmptyAdvertisementDto = (): AdvertisementDto => {
  return {};
};
