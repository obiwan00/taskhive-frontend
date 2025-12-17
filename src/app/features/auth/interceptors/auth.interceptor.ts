import {Injectable, inject} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import {Observable, throwError, BehaviorSubject} from 'rxjs';
import {catchError, switchMap, filter, take} from 'rxjs/operators';
import {TokenService, AuthService} from '../services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly tokenService = inject(TokenService);
  private readonly authService = inject(AuthService);

  private isRefreshTokenInProgress = false;
  private refreshToken$$ = new BehaviorSubject<string | null>(null);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = this.tokenService.getAccessToken();

    if (accessToken) {
      request = this.addToken(request, accessToken);
    }

    return next.handle(request).pipe(
      catchError(error => this.handleRequestError(error, request, next))
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handleRequestError(error: any, request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (error instanceof HttpErrorResponse && error.status === 401) {
      return this.handle401Error(request, next);
    }

    return throwError(() => error);
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.isRefreshTokenInProgress
      ? this.waitForTokenRefresh(request, next)
      : this.performTokenRefresh(request, next);
  }

  private waitForTokenRefresh(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.refreshToken$$.pipe(
      filter(token => token != null),
      take(1),
      switchMap(token => next.handle(this.addToken(request, token!)))
    );
  }

  private performTokenRefresh(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.isRefreshTokenInProgress = true;
    this.refreshToken$$.next(null);

    return this.authService.refreshAccessToken().pipe(
      switchMap(() => this.retryRequestWithNewToken(request, next)),
      catchError(error => this.handleRefreshError(error))
    );
  }

  private retryRequestWithNewToken(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.isRefreshTokenInProgress = false;
    const newAccessToken = this.tokenService.getAccessToken();
    this.refreshToken$$.next(newAccessToken);
    return next.handle(this.addToken(request, newAccessToken!));
  }

  private handleRefreshError(error: any): Observable<never> {
    this.isRefreshTokenInProgress = false;
    this.authService.logout();
    return throwError(() => error);
  }
}

