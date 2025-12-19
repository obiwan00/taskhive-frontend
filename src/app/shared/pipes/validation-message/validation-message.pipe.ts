import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

import { getValidationMessage } from '@shared/constants';

@Pipe({
  name: 'validationMessage',
})
export class ValidationMessagePipe implements PipeTransform {
  transform(errors: Record<string, ValidationErrors> | null | undefined): string {
    return getValidationMessage(errors);
  }
}
