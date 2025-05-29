export type CategoryBrandCharacteristicsViewModelResponse = {
  id: string;
  name: string;
  values: CategoryBrandCharacteristicsItemViewModelResponse[];
}

export type CategoryBrandCharacteristicsItemViewModelResponse = {
  value: string;
}
