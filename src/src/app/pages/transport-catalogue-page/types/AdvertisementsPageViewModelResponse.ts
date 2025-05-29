import {
  Advertisement,
  AdvertisementCharacteristic,
  AdvertisementPhotos,
} from './advertisement';

export type AdvertisementsPageViewModelResponse = {
  data: AdvertisementViewModelResponse[];
  totals: number;
  averagePrice: number;
  minimalPrice: number;
  maximumPrice: number;
};

export type AdvertisementViewModelResponse = {
  advertisement: AdvertisementViewModelAttributeDetails;
  geoInformation: AdvertisementViewModelGeoDetails;
  characteristics: AdvertisementViewModelCharacteristicDetails[];
};

export type AdvertisementViewModelAttributeDetails = {
  id: string;
  categoryId: string;
  brandId: string;
  geoId: string;
  priceExtra: string;
  priceValue: number;
  sourceId: number;
  sourceName: string;
  sourceUrl: string;
  description: string;
  title: string;
  photos: string[];
};

export type AdvertisementViewModelGeoDetails = {
  id: string;
  details: string;
};

export type AdvertisementViewModelCharacteristicDetails = {
  name: string;
  value: string;
};

export class AdvertisementsViewModelResponseConverter {
  public static convertToAdvertisement(
    viewModel: AdvertisementViewModelResponse,
  ): Advertisement {
    const advertisementAttributes: AdvertisementViewModelAttributeDetails =
      viewModel.advertisement;
    const advertisementGeoInfo: AdvertisementViewModelGeoDetails =
      viewModel.geoInformation;
    const advertisementCharacteristics: AdvertisementViewModelCharacteristicDetails[] =
      viewModel.characteristics;
    return {
      id: advertisementAttributes.id,
      brandId: advertisementAttributes.brandId,
      categoryId: advertisementAttributes.categoryId,
      priceExtra: advertisementAttributes.priceExtra,
      geoName: advertisementGeoInfo.details,
      sourceUrl: advertisementAttributes.sourceUrl,
      photos: advertisementAttributes.photos.map(
        (item): AdvertisementPhotos => {
          return { sourceUrl: item };
        },
      ),
      title: advertisementAttributes.title,
      description: advertisementAttributes.description,
      priceValue: advertisementAttributes.priceValue,
      characteristics: advertisementCharacteristics.map(
        (item): AdvertisementCharacteristic => {
          return { name: item.name, value: item.value };
        },
      ),
    };
  }
}
