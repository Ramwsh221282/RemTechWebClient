import { Routes } from '@angular/router';
import { TransportCatalogueRoutes } from './pages/transport-catalogue-page/transport-catalogue-routes';
import { AdminPageRoutes } from './pages/admin-page/admin-page.routes';
import { MainPageRoutes } from './pages/main-page/main-page-routes';

export const routes: Routes = [
  ...MainPageRoutes,
  ...AdminPageRoutes,
  ...TransportCatalogueRoutes,
];
