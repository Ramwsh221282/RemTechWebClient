import { Advertisement } from '../types/advertisement';

export type AdvertisementsPageResponse = {
  advertisements: Advertisement[];
  totals: number;
  pages: number;
  maxPrice: number;
  minPrice: number;
  avgPrice: number;
};
