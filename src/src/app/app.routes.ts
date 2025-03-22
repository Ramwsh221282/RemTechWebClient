import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'transport-catalogue',
    loadComponent: () =>
      import(
        './pages/transport-catalogue-page/transport-catalogue-page.component'
      ).then((c) => c.TransportCataloguePageComponent),
  },
];
