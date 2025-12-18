import {Component, ChangeDetectionStrategy, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../../services';
import {HttpErrorResponse} from '@angular/common/http';
import {LoginUser} from '../../models';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {InfoBlockComponent} from '@shared/components';
import {ValidationMessagePipe} from '@core/pipe';


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

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.nonNullable.group({
    email: this.fb.nonNullable.control('', {validators: [Validators.required, Validators.email]}),
    password: this.fb.nonNullable.control('', {validators: [Validators.required, Validators.minLength(6)]})
  });

  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const data: LoginUser = this.loginForm.getRawValue();

    this.authService.login(data).subscribe({
      next: () => {
        this.router.navigate(['/app']);
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
      'Login failed. Please try again.'
    );
  }
}

