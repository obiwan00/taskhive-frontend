import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { ScreenSizeService } from '@core/services';

export const unsupportedScreenOnlyGuard: CanActivateFn = () => {
  const screenSizeService = inject(ScreenSizeService);
  const router = inject(Router);

  if (!screenSizeService.isDesktopSize) {
    return true;
  }

  return router.createUrlTree(['/']);
};

