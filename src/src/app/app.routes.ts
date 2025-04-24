import {Routes} from '@angular/router';
import {TransportCatalogueRoutes} from './pages/transport-catalogue-page/transport-catalogue-routes';
import {AdminPageRoutes} from './pages/admin-page/admin-page.routes';

export const routes: Routes = [
  ...AdminPageRoutes,
  ...TransportCatalogueRoutes
];
