import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { advertisementsApi } from '../../../../shared/api/api-endpoint';
import { Observable } from 'rxjs';
import { Envelope } from '../../../../shared/types/Envelope';
import { CategoryBrand } from '../types/category-brand';
import {
  BrandViewModelResponse,
  CategoryBrandViewModelResponse,
} from '../../types/BrandViewModelResponse';

@Injectable({
  providedIn: 'root',
})
export class CategoryBrandsHttpService {
  private readonly _httpClient: HttpClient;
  private _apiUrl: string;
  private _categoryId: string;

  constructor(httpClient: HttpClient) {
    this._httpClient = httpClient;
    this._apiUrl = '';
    this._categoryId = '';
  }

  public setCategoryId(categoryId: string): void {
    this._categoryId = categoryId;
    this._apiUrl = `${advertisementsApi}/transport-categories/${this._categoryId}/brands`;
  }

  public fetchCategoryBrands(): Observable<Envelope<BrandViewModelResponse[]>> {
    return this._httpClient.get<Envelope<BrandViewModelResponse[]>>(
      this._apiUrl,
    );
  }

  public fetchCategoryBrandById(
    brandId: string,
  ): Observable<Envelope<CategoryBrandViewModelResponse>> {
    return this._httpClient.get<Envelope<CategoryBrandViewModelResponse>>(
      `${this._apiUrl}/${brandId}`,
    );
  }
}
