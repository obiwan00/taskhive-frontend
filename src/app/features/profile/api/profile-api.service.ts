import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UserProfile } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProfileApiService {
  private readonly http = inject(HttpClient);

  getUserProfile() {
    return this.http.get<UserProfile>('/api/me');
  }
}

