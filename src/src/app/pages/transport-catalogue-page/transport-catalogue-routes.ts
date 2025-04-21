import {Routes} from "@angular/router";

export const TransportCatalogueRoutes:
  Routes = [
  {
    path: 'transport-catalogue/categories',
    loadComponent: () =>
      import ('./transport-categories-menu/transport-categories-menu.component')
        .then((c) => c.TransportCategoriesMenuComponent)
  },
  {
    path: 'transport-catalogue/categories/:id/brands',
    loadComponent: () =>
      import('./category-brands-menu/category-brands-menu.component')
        .then((c) => c.CategoryBrandsMenuComponent)
  },
  {
    path: 'transport-catalogue/categories/:id/brands/:brandid/transports',
    loadComponent: () =>
      import('./transport-catalogue-page.component')
        .then((c) => c.TransportCataloguePageComponent)
  },
  {
    path: 'transport-catalogue/categories/:id/brands/:brandid/transports/:transportId',
    loadComponent: () =>
      import('../transport-item-page/transport-item-page.component')
        .then((c) => c.TransportItemPageComponent),
  },
]
