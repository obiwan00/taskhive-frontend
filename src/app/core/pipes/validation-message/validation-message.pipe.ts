import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

import { getValidationMessage } from './validation-messages';

@Pipe({
  name: 'validationMessage',
})
export class ValidationMessagePipe implements PipeTransform {
  transform(errors: Record<string, ValidationErrors> | null | undefined): string {
    return getValidationMessage(errors);
  }
}
