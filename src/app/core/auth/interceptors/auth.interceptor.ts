import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

import { AuthService, TokenService } from '../services';
import { SKIP_AUTH_REFRESH } from '../tokens/skip-auth-refresh.context-token';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly tokenService = inject(TokenService);
  private readonly authService = inject(AuthService);

  private isRefreshTokenInProgress = false;
  private refreshToken$$ = new BehaviorSubject<string | null>(null);

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const accessToken = this.tokenService.getAccessToken();

    if (accessToken) {
      request = this.addToken(request, accessToken);
    }

    return next.handle(request).pipe(
      catchError(error => this.handleRequestError(error, request, next))
    );
  }

  private addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handleRequestError(error: unknown, request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (error instanceof HttpErrorResponse && error.status === 401 && !this.shouldSkipRefresh(request)) {
      return this.handle401Error(request, next);
    }

    return throwError(() => error);
  }

  private shouldSkipRefresh(request: HttpRequest<unknown>): boolean {
    return request.context.get(SKIP_AUTH_REFRESH);
  }

  private handle401Error(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.isRefreshTokenInProgress
      ? this.waitForTokenRefresh(request, next)
      : this.performTokenRefresh(request, next);
  }

  private waitForTokenRefresh(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.refreshToken$$.pipe(
      filter(token => token != null),
      take(1),
      switchMap(token => next.handle(this.addToken(request, token!)))
    );
  }

  private performTokenRefresh(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (this.shouldSkipRefresh(request)) {
      return throwError(() => new Error('401 received for an auth request; token refresh not applicable'));
    }

    this.isRefreshTokenInProgress = true;
    this.refreshToken$$.next(null);

    return this.authService.refreshAccessToken().pipe(
      switchMap(() => this.retryRequestWithNewToken(request, next)),
      catchError(error => this.handleRefreshError(error))
    );
  }

  private retryRequestWithNewToken(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.isRefreshTokenInProgress = false;
    const newAccessToken = this.tokenService.getAccessToken();
    if (!newAccessToken) {
      this.authService.logout();
      return throwError(() => new Error('Access token missing after refresh'));
    }

    this.refreshToken$$.next(newAccessToken);
    return next.handle(this.addToken(request, newAccessToken));
  }

  private handleRefreshError(error: unknown): Observable<never> {
    this.isRefreshTokenInProgress = false;
    this.authService.logout();
    return throwError(() => error);
  }
}

