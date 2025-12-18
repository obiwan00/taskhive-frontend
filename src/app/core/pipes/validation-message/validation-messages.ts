import {ValidationErrors} from '@angular/forms';

type ValidationMessage = string | ((error: ValidationErrors) => string);

export const ValidationMessages: Record<string, ValidationMessage> = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  minlength: (error) => `Must be at least ${error['requiredLength']} characters`,
  maxlength: (error) => `Must not exceed ${error['requiredLength']} characters`,
  passwordMismatch: 'Passwords do not match',
  passwordRequiresDigit: 'Passwords must have at least one digit (0-9)',
  passwordRequiresUpper: 'Passwords must have at least one uppercase (A-Z)',
  passwordRequiresNonAlphanumeric: 'Passwords must have at least one special character (example: !@#$%^&*)',
  invalid: 'Invalid value',
} as const;

export function getValidationMessage(error: Record<string, ValidationErrors> | null | undefined): string {
  if (!error) {
    return '';
  }

  const errorKey = Object.keys(error)[0];
  const errorValue = error[errorKey];
  const message = ValidationMessages[errorKey];

  if (!message) {
    return ValidationMessages['invalid'] as string;
  }

  if (typeof message === 'function') {
    return message(errorValue);
  }

  return message;
}

