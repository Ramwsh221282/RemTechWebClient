import {Injectable, signal, WritableSignal} from '@angular/core';
import {TransportCategory} from '../types/TransportCategory';
import {TransportCategoriesHttpService} from './transport-categories-http.service';
import {finalize} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransportCategoriesViewModel {
  private readonly _httpService: TransportCategoriesHttpService;
  private _isLoading: WritableSignal<boolean> = signal(false);
  private _categories: TransportCategory[] = [];

  constructor(httpService: TransportCategoriesHttpService) {
    this._httpService = httpService;
  }

  public get categories(): TransportCategory[] {
    return this._categories;
  }

  public get isLoading(): boolean {
    return this._isLoading();
  }

  public initialize(): void {
    this.fetchCategories();
  }

  private fetchCategories(): void {
    this._isLoading.set(true);
    this._httpService.fetchCategories().pipe(
      finalize(() => this._isLoading.set(false))
    ).subscribe((response) => {
      if (response.code === 200) {
        const data = response.data;
        this._categories = [...data];
      }
    })
  }
}
