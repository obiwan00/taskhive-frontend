import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { ProfileService } from '../services/profile.service';

export const loadProfileGuard: CanActivateFn = (route, state) => {
  const profileService = inject(ProfileService);

  if (!profileService.profile()) {
    profileService.loadProfile()
      .subscribe({
        error: (err) => console.error('Failed to load profile in guard', err)
      });
  }

  return true;
};
