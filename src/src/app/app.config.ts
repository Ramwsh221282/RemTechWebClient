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
import { provideHttpClient } from '@angular/common/http';
import { ParserHttpService } from './pages/admin-page/admin-parsers-panel/services/parser-http.service';
import { definePreset } from '@primeng/themes';
import { AdvertisementsHttpService } from './pages/transport-catalogue-page/services/advertisements-http.service';
import { TransportItemHttpService } from './pages/transport-item-page/services/transport-item-http.service';
import { TransportCategoriesHttpService } from './pages/transport-catalogue-page/transport-categories-menu/services/transport-categories-http.service';
import { CategoryBrandsHttpService } from './pages/transport-catalogue-page/category-brands-menu/services/category-brands-http.service';
import { TransportCatalogueCategorybrandFetcherService } from './pages/transport-catalogue-page/services/transport-catalogue-categorybrand-fetcher.service';
import { TransportCataloguePageHttpService } from './pages/transport-catalogue-page/services/transport-catalogue-page.http.service';

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
    provideHttpClient(),
    AppMenuService,
    ParserHttpService,
    AdvertisementsHttpService,
    TransportItemHttpService,
    TransportCategoriesHttpService,
    CategoryBrandsHttpService,
    TransportCatalogueCategorybrandFetcherService,
    TransportCataloguePageHttpService,
  ],
};
