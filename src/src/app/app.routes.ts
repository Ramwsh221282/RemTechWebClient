import { Routes } from '@angular/router';
import { TransportCatalogueRoutes } from './pages/transport-catalogue-page/transport-catalogue-routes';
import { AdminPageRoutes } from './pages/admin-page/admin-page.routes';
import { MainPageRoutes } from './pages/main-page/main-page-routes';
import { RegistrationConfirmationRoute } from './pages/registration-confirmation-page/registration-confirmation-route';
import { UserRegisterRoutes } from './pages/user-register-page/user-register-route';
import { UserAuthRoutes } from './pages/user-auth-page/user-auth-routes';
import { ForbiddenPageRoutes } from './pages/forbidden-page/forbidden-page-routes';
import { SparesPageRoutes } from './pages/spares-page/spares-page-routes';

export const routes: Routes = [
  ...MainPageRoutes,
  ...AdminPageRoutes,
  ...TransportCatalogueRoutes,
  ...RegistrationConfirmationRoute,
  ...UserRegisterRoutes,
  ...UserAuthRoutes,
  ...ForbiddenPageRoutes,
  ...SparesPageRoutes
];
