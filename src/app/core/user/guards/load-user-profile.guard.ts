import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { UserService } from '../services';

export const loadUserProfileGuard: CanActivateFn = (route, state) => {
  const profileService = inject(UserService);

  if (!profileService.profile()) {
    profileService.loadProfile()
      .subscribe({
        error: (err) => console.error('Failed to load user profile in guard', err)
      });
  }

  return true;
};
