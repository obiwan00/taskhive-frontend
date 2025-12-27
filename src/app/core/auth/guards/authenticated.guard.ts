import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AppNavRoutes } from '@core/navigation-routes';

import { AuthService } from '../services';

export const authenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree([AppNavRoutes.auth.login]);
};

