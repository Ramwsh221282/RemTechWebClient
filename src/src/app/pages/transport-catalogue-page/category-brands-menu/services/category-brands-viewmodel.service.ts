import {Injectable, signal, WritableSignal} from '@angular/core';
import {CategoryBrandsHttpService} from './category-brands-http.service';
import {CategoryBrand} from '../types/category-brand';
import {finalize} from 'rxjs';
import {
  TransportCategoriesHttpService
} from '../../transport-categories-menu/services/transport-categories-http.service';
import {TransportCategory, TransportCategoryFactory} from '../../transport-categories-menu/types/TransportCategory';
import {Title} from '@angular/platform-browser';

@Injectable({
  providedIn: 'any'
})
export class CategoryBrandsViewModelService {
  private readonly _categoryBrandsHttpService: CategoryBrandsHttpService;
  private readonly _categoriesHttpService: TransportCategoriesHttpService;
  private readonly _isLoading: WritableSignal<boolean>;
  private _categoryBrands: CategoryBrand[];
  private _category: TransportCategory;

  constructor(categoryBrandsHttpService: CategoryBrandsHttpService, categoriesHttpService: TransportCategoriesHttpService) {
    this._categoryBrandsHttpService = categoryBrandsHttpService;
    this._categoriesHttpService = categoriesHttpService;
    this._categoryBrands = [];
    this._category = TransportCategoryFactory.default();
    this._isLoading = signal(false);
  }

  public get categoryBrands(): CategoryBrand[] {
    return this._categoryBrands;
  }

  public get isLoading(): boolean {
    return this._isLoading();
  }

  public get category(): TransportCategory {
    return this._category;
  }

  public initialize(categoryId: string, titleService: Title): void {
    this._categoryBrandsHttpService.setCategoryId(categoryId);
    this.fetchCategoryBrands();
    this.fetchCategory(categoryId, titleService);
  }

  private fetchCategoryBrands(): void {
    this._isLoading.set(true);
    this._categoryBrandsHttpService.fetchCategoryBrands()
      .pipe(finalize(() => this._isLoading.set(false)))
      .subscribe((response) => {
        if (response.code === 200) this._categoryBrands = response.data;
      })
  }

  private fetchCategory(categoryId: string, titleService: Title): void {
    this._categoriesHttpService.fetchById(categoryId)
      .subscribe((response) => {
        if (response.code === 200) {
          this._category = {...response.data};
          titleService.setTitle(`${this._category.name} бренды.`);
        }
      })
  }
}
