import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'invoke',
})
export class InvokePipe implements PipeTransform {
  transform<T, R>(value: T, callback: (arg: T, ...args: unknown[]) => R, ...params: unknown[]): R {
    return callback(value, ...params);
  }
}

