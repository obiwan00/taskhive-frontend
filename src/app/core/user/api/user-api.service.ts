import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '@environments/environment';

import { UserProfile } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  getUserProfile() {
    return this.http.get<UserProfile>(`${this.apiBaseUrl}/api/me`);
  }
}

