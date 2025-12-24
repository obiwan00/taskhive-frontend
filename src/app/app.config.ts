import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { AuthInterceptor } from '@core/auth';
import { MIN_DESKTOP_WIDTH, PROJECT_GITHUB_REPO } from '@core/tokens';

import { materialConfigurationProviders } from './app.material.config';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi(),
    ),
    ...materialConfigurationProviders,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: MIN_DESKTOP_WIDTH, useValue: 991 },
    { provide: PROJECT_GITHUB_REPO, useValue: 'https://github.com/obiwan00/taskhive-backend' },
  ]
};
