import { computed, Injectable, signal } from '@angular/core';

type LoaderToken = symbol;

@Injectable({
  providedIn: 'root'
})
export class GlobalLoaderService {

  private readonly activeLoaders = signal<Set<LoaderToken>>(new Set());

  readonly isLoading = computed(() => this.activeLoaders().size > 0);

  acquire(): LoaderToken {
    const token = Symbol('loader');
    this.activeLoaders.update(set => new Set(set).add(token));
    return token;
  }

  release(token: LoaderToken): void {
    this.activeLoaders.update(set => {
      const next = new Set(set);
      next.delete(token);
      return next;
    });
  }
}

