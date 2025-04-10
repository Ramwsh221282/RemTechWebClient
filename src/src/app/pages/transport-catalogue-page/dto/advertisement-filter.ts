export type AdvertisementFilter = {
  priceFilter: PriceFilter;
  addressFilter: AddressFilter;
  textFilter: TextFilter;
  characteristicsFilter: CharacteristicsFilter;
};

export type PriceFilter = {
  priceFrom: string;
  priceTo: string;
};

export type AddressFilter = {
  address: string;
};

export type TextFilter = {
  text: string;
};

export type CharacteristicsFilter = {
  characteristics: CharacteristicFilterOption[];
};

export type CharacteristicFilterOption = {
  name: string;
  value: string;
};

export class AdvertisementFilterService {
  public static createEmpty(): AdvertisementFilter {
    const priceFilter: PriceFilter = { priceFrom: '', priceTo: '' };
    const addressFilter: AddressFilter = { address: '' };
    const textFilter: TextFilter = { text: '' };
    const characteristicsFilter: CharacteristicsFilter = {
      characteristics: [],
    };
    return {
      priceFilter: priceFilter,
      addressFilter: addressFilter,
      textFilter: textFilter,
      characteristicsFilter: characteristicsFilter,
    };
  }

  public static applyPriceFrom(
    filter: AdvertisementFilter,
    priceFrom: string
  ): AdvertisementFilter {
    const priceCopy = { ...filter.priceFilter, priceFrom: priceFrom };
    return { ...filter, priceFilter: priceCopy };
  }

  public static applyPriceTo(
    filter: AdvertisementFilter,
    priceTo: string
  ): AdvertisementFilter {
    const priceCopy = { ...filter.priceFilter, priceTo: priceTo };
    return { ...filter, priceFilter: priceCopy };
  }

  public static applyAddress(
    filter: AdvertisementFilter,
    address: string
  ): AdvertisementFilter {
    const addressCopy = { ...filter.addressFilter };
    addressCopy.address = address;
    return { ...filter, addressFilter: addressCopy };
  }

  public static applyTextFilter(
    filter: AdvertisementFilter,
    text: string
  ): AdvertisementFilter {
    const textFilterCopy = { ...filter.textFilter };
    textFilterCopy.text = text;
    return { ...filter, textFilter: textFilterCopy };
  }

  public static appplyCharacteristics(
    filter: AdvertisementFilter,
    characteristics: CharacteristicFilterOption[]
  ): AdvertisementFilter {
    const characteristicsFilter: CharacteristicsFilter = { characteristics };
    return { ...filter, characteristicsFilter: characteristicsFilter };
  }
}
