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
  geoInformationId: string;
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
    const addressFilter: AddressFilter = { geoInformationId: '' };
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
    priceFrom: string,
  ): AdvertisementFilter {
    const priceCopy = { ...filter.priceFilter, priceFrom: priceFrom };
    return { ...filter, priceFilter: priceCopy };
  }

  public static applyPriceTo(
    filter: AdvertisementFilter,
    priceTo: string,
  ): AdvertisementFilter {
    const priceCopy = { ...filter.priceFilter, priceTo: priceTo };
    return { ...filter, priceFilter: priceCopy };
  }

  public static resetPrice(filter: AdvertisementFilter): AdvertisementFilter {
    const priceCopy = { ...filter.priceFilter, priceFrom: '', priceTo: '' };
    return { ...filter, priceFilter: priceCopy };
  }

  public static applyAddress(
    filter: AdvertisementFilter,
    address: string,
  ): AdvertisementFilter {
    const addressCopy = { ...filter.addressFilter };
    addressCopy.geoInformationId = address;
    return { ...filter, addressFilter: addressCopy };
  }

  public static applyTextFilter(
    filter: AdvertisementFilter,
    text: string,
  ): AdvertisementFilter {
    const textFilterCopy = { ...filter.textFilter };
    textFilterCopy.text = text;
    return { ...filter, textFilter: textFilterCopy };
  }

  public static appplyCharacteristics(
    filter: AdvertisementFilter,
    characteristics: CharacteristicFilterOption[],
  ): AdvertisementFilter {
    const characteristicsFilter: CharacteristicsFilter = { characteristics };
    return { ...filter, characteristicsFilter: characteristicsFilter };
  }

  public static applyCharacteristic(
    filter: AdvertisementFilter,
    characteristic: CharacteristicFilterOption,
  ): AdvertisementFilter {
    const currentCharacteristicsFilter = filter.characteristicsFilter;
    const currentCharacteristics: CharacteristicFilterOption[] =
      currentCharacteristicsFilter.characteristics;
    const index = currentCharacteristics.findIndex(
      (c) => c.name === characteristic.name,
    );
    if (index >= 0) {
      currentCharacteristics[index].value = characteristic.value;
    } else {
      currentCharacteristics.push(characteristic);
    }
    currentCharacteristicsFilter.characteristics = [...currentCharacteristics];
    return { ...filter, characteristicsFilter: currentCharacteristicsFilter };
  }
}
