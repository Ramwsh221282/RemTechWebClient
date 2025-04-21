import {Injectable} from '@angular/core';
import {TransportCategory, TransportCategoryFactory} from '../transport-categories-menu/types/TransportCategory';
import {CategoryBrand, CategoryBrandFactory} from '../category-brands-menu/types/category-brand';
import {TransportCategoriesHttpService} from '../transport-categories-menu/services/transport-categories-http.service';
import {CategoryBrandsHttpService} from '../category-brands-menu/services/category-brands-http.service';
import {map, Observable, switchMap} from 'rxjs';

export type CategoryBrandFetcherResponse = {
  category: TransportCategory,
  categoryBrand: CategoryBrand;
}

@Injectable({
  providedIn: 'root'
})
export class TransportCatalogueCategorybrandFetcherService {
  private readonly _categoriesHttpService: TransportCategoriesHttpService;
  private readonly _categoryBrandsHttpService: CategoryBrandsHttpService;

  constructor(categoriesHttpService: TransportCategoriesHttpService, categoryBrandsHttpService: CategoryBrandsHttpService) {
    this._categoriesHttpService = categoriesHttpService;
    this._categoryBrandsHttpService = categoryBrandsHttpService;
  }

  public fetchCategoryBrands(categoryId: string, brandId: string): Observable<CategoryBrandFetcherResponse> {
    return this._categoriesHttpService.fetchById(categoryId)
      .pipe(
        switchMap((response) => {
          let result: CategoryBrandFetcherResponse = {
            category: TransportCategoryFactory.default(),
            categoryBrand: CategoryBrandFactory.default()
          };

          if (response.code === 200) {
            result.category = {...response.data};
            this._categoryBrandsHttpService.setCategoryId(result.category.id);
            return this._categoryBrandsHttpService.fetchCategoryBrandById(brandId).pipe(
              map((brandResponse) => {
                if (brandResponse.code === 200) {
                  result.categoryBrand = {...brandResponse.data};
                }
                return result;
              })
            )
          } else {
            return [result]
          }
        })
      )
  }
}
