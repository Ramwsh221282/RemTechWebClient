import { Routes } from '@angular/router';

export const VehicleCatalogueSelectRoutes: Routes = [
  {
    path: 'vehicles',
    loadComponent: () =>
      import('./vehicles-catalogue-select-page.component').then(
        (c) => c.VehiclesCatalogueSelectPageComponent,
      ),
  },
];
