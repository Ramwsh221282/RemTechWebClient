import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';
import { AppMenuService } from './shared/components/app-menu/app-menu.service';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { definePreset } from '@primeng/themes';
import { AdvertisementsHttpService } from './pages/transport-catalogue-page/services/advertisements-http.service';
import { TransportItemHttpService } from './pages/transport-item-page/services/transport-item-http.service';
import { TransportCategoriesHttpService } from './pages/transport-catalogue-page/transport-categories-menu/services/transport-categories-http.service';
import { CategoryBrandsHttpService } from './pages/transport-catalogue-page/category-brands-menu/services/category-brands-http.service';
import { TransportCatalogueCategorybrandFetcherService } from './pages/transport-catalogue-page/services/transport-catalogue-categorybrand-fetcher.service';
import { TransportCataloguePageHttpService } from './pages/transport-catalogue-page/services/transport-catalogue-page.http.service';
import { TransportCatalogueRouteBuilder } from './pages/transport-catalogue-page/transport-catalogue-routes';
import { ParsersHttpService } from './pages/admin-page/admin-panel-menu/admin-panel-parsers-menu/services/parsers-http.service';
import { MailingServiceHttpService } from './pages/admin-page/admin-panel-menu/admin-panel-mailing-service-menu/services/mailing-service-http.service';
import { UsersService } from './shared/services/users.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthStatusService } from './shared/services/auth-status.service';
import { authInterceptor } from './shared/middleware/auth.interceptor';
import { expiredTokenInterceptor } from './shared/middleware/expired-token.interceptor';
import { tokenApplyInterceptor } from './shared/middleware/token-apply.interceptor';
import { SpareParserHttpService } from './pages/admin-page/admin-panel-menu/admin-panel-spare-parsers-menu/services/spare-parser-http.service';
import { SparesHttpService } from './pages/admin-page/admin-panel-menu/admin-panel-spare-parsers-menu/services/spares-http.service';
import { ApiVehicleKindSource } from './pages/vehicles-catalogue-select-page/data/sources/apivehiclekindsource';
import { ApiVehicleBrandsSource } from './pages/vehicles-catalogue-select-page/data/sources/apivehiclebrandssource';
import { ApiVehicleModelsSource } from './pages/vehicles-catalogue-select-page/data/sources/apivehiclemodelssource';
import { BasicVehicleBrandsSource } from './pages/vehicles-catalogue-page/services/data-sources/BasicVehicleBrandsSource';
import { BasicVehicleKindsSource } from './pages/vehicles-catalogue-page/services/data-sources/BasicVehicleKindsSource';
import { BasicVehicleModelsSource } from './pages/vehicles-catalogue-page/services/data-sources/BasicVehicleModelsSource';

const myPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{yellow.50}',
      100: '{yellow.100}',
      200: '{yellow.200}',
      300: '{yellow.300}',
      400: '{yellow.400}',
      500: '{yellow.500}',
      600: '{yellow.600}',
      700: '{yellow.700}',
      800: '{yellow.800}',
      900: '{yellow.900}',
      950: '{yellow.950}',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: myPreset,
      },
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions(), withComponentInputBinding()),

    provideHttpClient(
      withInterceptors([
        tokenApplyInterceptor,
        expiredTokenInterceptor,
        authInterceptor,
      ]),
    ),
    BasicVehicleBrandsSource,
    BasicVehicleKindsSource,
    BasicVehicleModelsSource,
    ApiVehicleKindSource,
    ApiVehicleBrandsSource,
    ApiVehicleModelsSource,
    AppMenuService,
    AdvertisementsHttpService,
    TransportItemHttpService,
    TransportCategoriesHttpService,
    CategoryBrandsHttpService,
    TransportCatalogueCategorybrandFetcherService,
    TransportCataloguePageHttpService,
    TransportCatalogueRouteBuilder,
    ParsersHttpService,
    MailingServiceHttpService,
    UsersService,
    CookieService,
    AuthStatusService,
    SpareParserHttpService,
    SparesHttpService,
  ],
};
