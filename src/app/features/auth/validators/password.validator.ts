import { ValidatorFn } from '@angular/forms';

export function passwordDigitValidator(): ValidatorFn {
  return (control) => {
    if (!control.value) {
      return null;
    }
    return /\d/.test(control.value) ? null : { passwordRequiresDigit: true };
  };
}

export function passwordUppercaseValidator(): ValidatorFn {
  return (control) => {
    if (!control.value) {
      return null;
    }
    return /[A-Z]/.test(control.value) ? null : { passwordRequiresUpper: true };
  };
}

export function passwordNonAlphanumericValidator(): ValidatorFn {
  return (control) => {
    if (!control.value) {
      return null;
    }
    return /[^a-zA-Z0-9]/.test(control.value) ? null : { passwordRequiresNonAlphanumeric: true };
  };
}

export function getPasswordValidators(): ValidatorFn[] {
  return [
    passwordDigitValidator(),
    passwordUppercaseValidator(),
    passwordNonAlphanumericValidator(),
  ];
}

