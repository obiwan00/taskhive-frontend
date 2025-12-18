import {effect, inject, Injectable, signal} from '@angular/core';
import {AuthService} from '@features/auth';
import {ProfileApiService} from '../api';
import {UserProfile} from '../models';
import {Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly profileApiService = inject(ProfileApiService);
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
