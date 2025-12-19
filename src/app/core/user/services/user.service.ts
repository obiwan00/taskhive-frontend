import { Injectable, effect, inject, signal } from '@angular/core';

import { Observable, tap } from 'rxjs';

import { AuthService } from '@core/auth';

import { UserApiService } from '../api';
import { UserProfile } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly profileApiService = inject(UserApiService);
  private readonly authService = inject(AuthService);

  private readonly userProfile = signal<UserProfile | null>(null);

  constructor() {
    this.subscribeForLogout();
  }

  loadProfile(): Observable<UserProfile> {
    return this.profileApiService.getUserProfile().pipe(
      tap(profile => this.userProfile.set(profile))
    );
  }

  get profile() {
    return this.userProfile.asReadonly();
  }

  private subscribeForLogout() {
    effect(() => {
      if (!this.authService.isLoggedIn()) {
        this.userProfile.set(null);
      }
    });
  }
}
