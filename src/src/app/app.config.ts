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
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { definePreset } from '@primeng/themes';
import { UsersService } from './shared/services/users.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthStatusService } from './shared/services/auth-status.service';
import { ApiVehicleKindSource } from './pages/vehicles-catalogue-select-page/data/sources/apivehiclekindsource';
import { ApiVehicleBrandsSource } from './pages/vehicles-catalogue-select-page/data/sources/apivehiclebrandssource';
import { ApiVehicleModelsSource } from './pages/vehicles-catalogue-select-page/data/sources/apivehiclemodelssource';
import { BasicVehicleBrandsSource } from './pages/vehicles-catalogue-page/services/data-sources/BasicVehicleBrandsSource';
import { BasicVehicleKindsSource } from './pages/vehicles-catalogue-page/services/data-sources/BasicVehicleKindsSource';
import { BasicVehicleModelsSource } from './pages/vehicles-catalogue-page/services/data-sources/BasicVehicleModelsSource';
import { VehicleCharacteristicsSource } from './pages/vehicles-catalogue-page/types/VehicleCharacteristics';
import { MailingManagementService } from './pages/mailing-management-page/services/MailingManagementService';
import { JwtTokenManagingInterceptor } from './shared/middleware/JwtTokenManagingInterceptor';
import { VehicleScrapersService } from './pages/scrapers-management-page/components/scrapers-management-settings-page/services/vehicle-scrapers.service';
import { SparesService } from './pages/spares-page/services/SparesService';

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
    provideHttpClient(withInterceptors([JwtTokenManagingInterceptor])),
    SparesService,
    VehicleScrapersService,
    MailingManagementService,
    VehicleCharacteristicsSource,
    BasicVehicleBrandsSource,
    BasicVehicleKindsSource,
    BasicVehicleModelsSource,
    ApiVehicleKindSource,
    ApiVehicleBrandsSource,
    ApiVehicleModelsSource,
    AppMenuService,
    UsersService,
    CookieService,
    AuthStatusService,
  ],
};
