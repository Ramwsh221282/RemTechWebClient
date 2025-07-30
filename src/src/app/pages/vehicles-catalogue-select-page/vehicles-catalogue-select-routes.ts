import { Routes } from '@angular/router';

export const VehicleCatalogueSelectRoutes: Routes = [
  {
    path: 'vehicles',
    loadComponent: () =>
      import('./vehicles-catalogue-select-page.component').then(
        (c) => c.VehiclesCatalogueSelectPageComponent,
      ),
  },
  {
    path: 'vehicles/kinds/:kindId/brands/:brandId/models/:modelId/catalogue',
    loadComponent: () =>
      import(
        '../vehicles-catalogue-page/vehicles-catalogue-page.component'
      ).then((c) => c.VehiclesCataloguePageComponent),
  },
];
