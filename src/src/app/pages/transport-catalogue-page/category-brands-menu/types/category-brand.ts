export type CategoryBrand = {
  categoryId: string;
  brandId: string;
  name: string
}

export class CategoryBrandFactory {
  public static default(): CategoryBrand {
    return {categoryId: '', brandId: '', name: ''}
  }
}
