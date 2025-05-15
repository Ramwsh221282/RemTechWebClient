import { Routes } from '@angular/router';
import { Injectable } from '@angular/core';

export const TransportCatalogueRoutes: Routes = [
  {
    path: 'transport-catalogue/categories',
    loadComponent: () =>
      import(
        './transport-categories-menu/transport-categories-menu.component'
      ).then((c) => c.TransportCategoriesMenuComponent),
  },
  {
    path: 'transport-catalogue/categories/:id/brands',
    loadComponent: () =>
      import('./category-brands-menu/category-brands-menu.component').then(
        (c) => c.CategoryBrandsMenuComponent,
      ),
  },
  {
    path: 'transport-catalogue/categories/:id/brands/:brandid/transports',
    loadComponent: () =>
      import('./transport-catalogue-page.component').then(
        (c) => c.TransportCataloguePageComponent,
      ),
  },
  {
    path: 'transport-catalogue/categories/:id/brands/:brandid/transports/geo/:geoId',
    loadComponent: () =>
      import('./transport-catalogue-page.component').then(
        (c) => c.TransportCataloguePageComponent,
      ),
  },
  {
    path: 'transport-catalogue/categories/:id/brands/:brandid/transports/models/:modelName',
    loadComponent: () =>
      import('./transport-catalogue-page.component').then(
        (c) => c.TransportCataloguePageComponent,
      ),
  },
  {
    path: 'transport-catalogue/categories/:id/brands/:brandid/transports/geo/:geoId/models/:modelName',
    loadComponent: () =>
      import('./transport-catalogue-page.component').then(
        (c) => c.TransportCataloguePageComponent,
      ),
  },
  {
    path: 'transport-catalogue/categories/:id/brands/:brandid/transports/:transportId',
    loadComponent: () =>
      import('../transport-item-page/transport-item-page.component').then(
        (c) => c.TransportItemPageComponent,
      ),
  },
  {
    path: 'transport-catalogue/:brandId/:name/categories',
    loadComponent: () =>
      import(
        './categories-by-brand-name-menu/categories-by-brand-name-menu.component'
      ).then((c) => c.CategoriesByBrandNameMenuComponent),
  },
];

@Injectable({
  providedIn: 'root',
})
export class TransportCatalogueRouteBuilder {
  public buildCategoriesRoute(): string {
    return '/transport-catalogue/categories';
  }

  public buildCategoryBrandsRoute(categoryId: string): string {
    return `/transport-catalogue/categories/${categoryId}/brands`;
  }

  public buildCategoryBrandTransportRoute(
    categoryId: string,
    brandId: string,
  ): string {
    return `/transport-catalogue/categories/${categoryId}/brands/${brandId}/transports`;
  }

  public buildCategoryBrandConcreteTransportRoute(
    categoryId: string,
    brandId: string,
    transportId: string,
  ): string {
    return `/transport-catalogue/categories/${categoryId}/brands/${brandId}/transports/${transportId}`;
  }

  public buildCategoriesOfBrandNameRoute(
    brandId: string,
    brandName: string,
  ): string {
    return `/transport-catalogue/${brandId}/${brandName}/categories`;
  }
}
