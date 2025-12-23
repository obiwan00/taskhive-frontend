import { ChangeDetectorRef, EmbeddedViewRef, inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'invoke',
})
export class InvokePipe<C> implements PipeTransform {

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly context = (this.cdr as EmbeddedViewRef<C>).context;

  transform<T, R>(value: T, callback: (arg: T, ...args: unknown[]) => R, ...params: unknown[]): R {
    return callback.apply(this.context, [value, ...params]);
  }
}

