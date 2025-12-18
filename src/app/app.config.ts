import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi} from '@angular/common/http';
import {AuthInterceptor} from '@features/auth';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi(),
    ),
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ]
};
