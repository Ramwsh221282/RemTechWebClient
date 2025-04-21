import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {apiUrl} from '../../../../shared/api/api-endpoint';
import {Observable} from 'rxjs';
import {Envelope} from '../../../../shared/types/Envelope';
import {CategoryBrand} from '../types/category-brand';

@Injectable({
  providedIn: 'root'
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
    this._apiUrl = `${apiUrl}/transport-categories/${this._categoryId}/brands`
  }

  public fetchCategoryBrands(): Observable<Envelope<CategoryBrand[]>> {
    return this._httpClient.get<Envelope<CategoryBrand[]>>(this._apiUrl);
  }

  public fetchCategoryBrandById(brandId: string): Observable<Envelope<CategoryBrand>> {
    return this._httpClient.get<Envelope<CategoryBrand>>(`${this._apiUrl}/${brandId}`);
  }
}
