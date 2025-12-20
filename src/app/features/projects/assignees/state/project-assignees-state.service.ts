import { computed, inject, Injectable, signal } from '@angular/core';

import { catchError, map, Observable, of, tap, throwError } from 'rxjs';

import { ProjectsAssigneesApiService } from '../api';

import { ProjectAssigneesState } from './project-assignees-state.model';


@Injectable()
export class ProjectAssigneesStateService {
  private readonly api = inject(ProjectsAssigneesApiService);

  private readonly _state = signal<ProjectAssigneesState>({
    assignees: null,
    loading: false,
    error: null,
  });

  readonly state = this._state.asReadonly();
  readonly assignees = computed(() => this._state().assignees);
  readonly loading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);

  private projectId?: string;

  init(projectId: string): Observable<void> {
    if (this.projectId === projectId) return of(void 0);

    this.projectId = projectId;
    this.clear();
    return this.load();
  }

  load(): Observable<void> {
    if (!this.projectId) return throwError(() => this.getUninitializedError());

    this._state.update(s => ({ ...s, loading: true }));

    return this.api.getList(this.projectId)
      .pipe(
        tap(result => {
          this._state.set({ assignees: result.items, loading: false, error: null });
        }),
        map(() => void 0),
        catchError(error => {
          this._state.set({ assignees: null, loading: false, error });

          return throwError(() => error);
        })
      );
  }

  clear(): void {
    this._state.set({
      assignees: null,
      loading: false,
      error: null
    });
  }

  private getUninitializedError(): Error {
    return new Error('Service is not initialized. Call \'init\' method first');
  }
}
