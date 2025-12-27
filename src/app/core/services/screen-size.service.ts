import { inject, Injectable } from '@angular/core';

import { fromEvent, map, Observable, startWith } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { MIN_DESKTOP_WIDTH } from '@core/tokens';


@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {
  private MIN_DESKTOP_WIDTH = inject(MIN_DESKTOP_WIDTH);

  isDesktopSize$(): Observable<boolean> {
    if (typeof window === 'undefined') {
      throw new Error('Window is undefined');
    }

    return fromEvent(window, 'resize')
      .pipe(
        debounceTime(300),
        map(() => this.isDesktopSize),
      );
  }

  get isDesktopSize(): boolean {
    return window.innerWidth >= this.MIN_DESKTOP_WIDTH;
  }
}

