import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AccessTokens, LoginUser, RefreshToken, RegisterUser } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly http = inject(HttpClient);

  register(data: RegisterUser) {
    return this.http.post<AccessTokens>('/api/auth/register', data);
  }

  login(data: LoginUser) {
    return this.http.post<AccessTokens>('/api/auth/login', data);
  }

  refreshToken(data: RefreshToken) {
    return this.http.post<AccessTokens>('/api/auth/refresh', data);
  }
}

