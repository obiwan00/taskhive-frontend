import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, catchError, map, of, tap } from 'rxjs';

import { AppNavRoutes } from '@core/navigation-routes';

import { AuthApiService } from '../api';
import { AccessTokens, LoginUser, RegisterUser } from '../models';

import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authApi = inject(AuthApiService);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);

  private isAuthenticated = signal(this.tokenService.hasAccessToken());

  login(data: LoginUser): Observable<void> {
    return this.authApi.login(data).pipe(
      tap((tokens: AccessTokens) => {
        this.tokenService.setTokens(tokens.accessToken, tokens.refreshToken);
        this.isAuthenticated.set(true);
      }),
      map(() => void 0),
      catchError(error => {
        this.isAuthenticated.set(false);
        throw error;
      })
    );
  }

  register(data: RegisterUser): Observable<void> {
    return this.authApi.register(data).pipe(
      tap((tokens: AccessTokens) => {
        this.tokenService.setTokens(tokens.accessToken, tokens.refreshToken);
        this.isAuthenticated.set(true);
      }),
      map(() => void 0),
      catchError(error => {
        this.isAuthenticated.set(false);
        throw error;
      })
    );
  }

  refreshAccessToken(): Observable<void> {
    const refreshToken = this.tokenService.getRefreshToken();

    if (!refreshToken) {
      this.logout();

      return of(void 0);
    }

    return this.authApi.refreshToken({ refreshToken }).pipe(
      tap((tokens: AccessTokens) => {
        this.tokenService.setTokens(tokens.accessToken, tokens.refreshToken);
      }),
      map(() => void 0),
      catchError(() => {
        this.logout();
        throw new Error('Token refresh failed');
      })
    );
  }

  logout(): void {
    this.tokenService.clearTokens();
    this.isAuthenticated.set(false);
    this.router.navigate([AppNavRoutes.auth.login]);
  }

  get isLoggedIn() {
    return this.isAuthenticated.asReadonly();
  }
}

