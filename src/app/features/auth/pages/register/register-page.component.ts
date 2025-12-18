import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';

import { ValidationMessagePipe } from '@core/pipe';
import { InfoBlockComponent } from '@shared/components';

import { RegisterUser } from '../../models';
import { AuthService } from '../../services';
import { getPasswordValidators, passwordMatchValidator } from '../../validators';




@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatError, MatFormField, MatInput, MatLabel, MatButton, InfoBlockComponent, ValidationMessagePipe],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  registerForm = this.fb.nonNullable.group(
    {
      email: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.email] }),
      firstName: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)] }),
      lastName: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)] }),
      password: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.minLength(6), ...getPasswordValidators()] }),
      confirmPassword: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    },
    { validators: passwordMatchValidator }
  );

  onSubmit(): void {
    if (this.registerForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const data: RegisterUser = this.registerForm.getRawValue();

    this.authService.register(data)
      .subscribe({
        next: () => {
          this.router.navigate(['/app']);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          this.handleError(error);
        },
      });
  }

  private handleError(error: HttpErrorResponse): void {
    const errorResponse = error.error;

    this.errorMessage.set(
      errorResponse?.message ||
      errorResponse?.detail ||
      'Registration failed. Please try again.'
    );
  }
}

