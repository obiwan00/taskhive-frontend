import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';

import { LoginUser } from '@core/auth';
import { AuthService } from '@core/auth';
import { AppNavRoutes } from '@core/navigation-routes';
import { ValidationMessagePipe } from '@shared/pipes';
import { InfoBlockComponent } from '@shared/ui';

import { AUTH_VALIDATION } from '../../constants';


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatError, MatFormField, MatLabel, MatInput, MatButton, InfoBlockComponent, ValidationMessagePipe],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly loginForm = this.fb.nonNullable.group({
    email: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.email] }),
    password: this.fb.nonNullable.control('', {
      validators: [
        Validators.required,
        Validators.minLength(AUTH_VALIDATION.PASSWORD_MIN_LENGTH),
        Validators.maxLength(AUTH_VALIDATION.PASSWORD_MAX_LENGTH)]
    })
  });

  protected onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const data: LoginUser = this.loginForm.getRawValue();

    this.authService.login(data).subscribe({
      next: () => {
        this.router.navigate([AppNavRoutes.appRoot]);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.handleError(error);
      }
    });
  }

  private handleError(error: HttpErrorResponse): void {
    const errorResponse = error.error;

    this.errorMessage.set(
      errorResponse?.message ||
      errorResponse?.detail ||
      'Login failed. Please try again'
    );
  }
}

