import { Pipe, PipeTransform } from '@angular/core';
import { getValidationMessage } from './validation-messages';
import {ValidationErrors} from '@angular/forms';

@Pipe({
  name: 'validationMessage',
})
export class ValidationMessagePipe implements PipeTransform {
  transform(errors: Record<string, ValidationErrors> | null | undefined): string {
    return getValidationMessage(errors);
  }
}
