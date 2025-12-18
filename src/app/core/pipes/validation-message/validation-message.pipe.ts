import { Pipe, PipeTransform } from '@angular/core';
import { getValidationMessage } from './validation-messages';

@Pipe({
  name: 'validationMessage',
})
export class ValidationMessagePipe implements PipeTransform {
  transform(errors: Record<string, any> | null | undefined): string {
    return getValidationMessage(errors);
  }
}
