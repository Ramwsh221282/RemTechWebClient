import { AdvertisementsPageResponse } from '../responses/advertisements-page-response';

export type AggregatedScalarData = {
  average: number;
  minimal: number;
  maximum: number;
  total: number;
};

export class AggregatedScalarDataFactory {
  public static default(): AggregatedScalarData {
    return { average: 0, minimal: 0, maximum: 0, total: 0 };
  }

  public static fromAdvertisementsPageResponse(
    response: AdvertisementsPageResponse,
  ): AggregatedScalarData {
    return {
      average: response.avgPrice,
      minimal: response.minPrice,
      maximum: response.maxPrice,
      total: response.totals,
    };
  }
}
