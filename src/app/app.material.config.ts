import { Provider } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

export const materialConfigurationProviders: Provider[] = [
  {
    provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    useValue: { appearance: 'outline' }
  },
  {
    provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
    useValue: {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000
    }
  },
];

