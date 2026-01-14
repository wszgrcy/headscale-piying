import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ThemeService } from '@piying-lib/angular-daisyui/service';
import { authInterceptor } from './interceptor/add-auth';
import { MyErrorHandler } from './service/error.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    ThemeService,
    {
      provide: ErrorHandler,
      useClass: MyErrorHandler,
    },
  ],
};
