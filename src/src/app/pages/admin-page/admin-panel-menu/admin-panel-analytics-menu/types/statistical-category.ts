export type StatisticalAggregatedData = {
  count: number;
  average: number;
  minimal: number;
  maximum: number;
};

export type StatisticalCategory = {
  id: string;
  name: string;
  data: StatisticalAggregatedData;
  brands: StatisticalCategoryBrand[];
};

export type StatisticalCategoryBrand = {
  id: string;
  categoryId: string;
  brandName: string;
  categoryName: string;
  data: StatisticalAggregatedData;
  advertisementsGeo: StatisticalCategoryBrandGeo[];
  transportModels: StatisticalTransportModel[];
};

export type StatisticalCategoryBrandGeo = {
  categoryName: string;
  categoryId: string;
  brandId: string;
  geoName: string;
  data: StatisticalAggregatedData;
};

export type StatisticalTransportModel = {
  brandName: string;
  categoryName: string;
  brandId: string;
  categoryId: string;
  model: string;
  data: StatisticalAggregatedData;
};

export class StatisticalCategoryFactory {
  public static defaultCategory(): StatisticalCategory {
    return { id: '', brands: [], name: '', data: this.defaultData() };
  }

  public static defaultData(): StatisticalAggregatedData {
    return { count: 0, average: 0, minimal: 0, maximum: 0 };
  }
}
