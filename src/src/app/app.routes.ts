import { Routes } from '@angular/router';
import { MainPageRoutes } from './pages/main-page/main-page-routes';
import { RegistrationConfirmationRoute } from './pages/registration-confirmation-page/registration-confirmation-route';
import { UserRegisterRoutes } from './pages/user-register-page/user-register-route';
import { UserAuthRoutes } from './pages/user-auth-page/user-auth-routes';
import { ForbiddenPageRoutes } from './pages/forbidden-page/forbidden-page-routes';
import { MailingManagementPageRoutes } from './pages/mailing-management-page/routing/MailingManagementPageRoutes';
import { SignInPageRoutes } from './pages/sign-in-page/SignInPareRoutes';
import { ScrapersManagementPageRoutes } from './pages/scrapers-management-page/ScrapersManagementPageRoutes';
import { SparesPageRoutes } from './pages/spares-page/spares-page-routes';
import { AllCategoriesRoute } from './pages/all-categories-page/AllCategoriesRoute';
import { AllBrandsPageRoutes } from './pages/all-brands-page/AllBrandsPageRoutes';
import { VehiclesPageRoutes } from './pages/vehicles-page/VehiclesPageRoutes';
import { ConcreteVehicleRoute } from './pages/concrete-vehicle-page/ConcreteVehicleRoute';

export const routes: Routes = [
  ...VehiclesPageRoutes,
  ...ConcreteVehicleRoute,
  ...AllBrandsPageRoutes,
  ...AllCategoriesRoute,
  ...SparesPageRoutes,
  ...MainPageRoutes,
  ...RegistrationConfirmationRoute,
  ...UserRegisterRoutes,
  ...UserAuthRoutes,
  ...ForbiddenPageRoutes,
  ...MailingManagementPageRoutes,
  ...SignInPageRoutes,
  ...ScrapersManagementPageRoutes,
];
