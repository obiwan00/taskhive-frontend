import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { AccessTokens, LoginUser, RefreshToken, RegisterUser } from '../models';
import { SKIP_AUTH_REFRESH } from '../tokens/skip-auth-refresh.context-token';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly http = inject(HttpClient);

  register(data: RegisterUser) {
    return this.http.post<AccessTokens>('/api/auth/register', data, {
      context: new HttpContext().set(SKIP_AUTH_REFRESH, true)
    });
  }

  login(data: LoginUser) {
    return this.http.post<AccessTokens>('/api/auth/login', data, {
      context: new HttpContext().set(SKIP_AUTH_REFRESH, true)
    });
  }

  refreshToken(data: RefreshToken) {
    return this.http.post<AccessTokens>('/api/auth/refresh', data, {
      context: new HttpContext().set(SKIP_AUTH_REFRESH, true)
    });
  }
}

