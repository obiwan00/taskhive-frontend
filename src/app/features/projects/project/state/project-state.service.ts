import { computed, inject, Injectable, signal } from '@angular/core';

import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';

import { ProjectsApiService } from '../api';
import { UpdateProject } from '../models';

import { ProjectState } from './project-state.model';


@Injectable()
export class ProjectStateService {
  private readonly api = inject(ProjectsApiService);

  private readonly _state = signal<ProjectState>({
    project: null,
    loading: false,
    error: null,
  });

  readonly state = this._state.asReadonly();
  readonly project = computed(() => this._state().project);
  readonly loading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);

  private projectId?: string;

  isProjectLoaded(projectId: string): boolean {
    return this.projectId === projectId && this.project()?.id === projectId;
  }

  init(projectId: string): Observable<void> {
    if (this.isProjectLoaded(projectId)) return of(void 0);

    this.projectId = projectId;
    this.clear();
    return this.load();
  }

  refresh(): Observable<void> {
    this.clear();
    return this.load();
  }

  load(): Observable<void> {
    if (!this.projectId) return throwError(() => this.getUninitializedError());

    this._state.update(s => ({ ...s, loading: true }));

    return this.api.getDetails(this.projectId)
      .pipe(
        tap(project => {
          this._state.set({ project, loading: false, error: null });
        }),
        map(() => void 0),
        catchError(error => {
          this._state.set({ project: null, loading: false, error });

          return throwError(() => error);
        })
      );
  }

  update(payload: UpdateProject): Observable<void> {
    if (!this.projectId) return throwError(() => this.getUninitializedError());

    this._state.update(s => ({ ...s, loading: true }));

    return this.api.update(this.projectId, payload)
      .pipe(
        switchMap(() => this.load()),
        map(() => void 0),
        catchError(error => {
          this._state.update(s => ({ ...s, loading: false, error }));

          return throwError(() => error);
        })
      );
  }

  delete(): Observable<void> {
    if (!this.projectId) return throwError(() => this.getUninitializedError());

    this._state.update(s => ({ ...s, loading: true }));

    return this.api.delete(this.projectId).pipe(
      tap(() => this.clear()),
      catchError(error => {
        this._state.update(s => ({ ...s, loading: false, error }));

        return throwError(() => error);
      })
    );
  }

  clear(): void {
    this._state.set({
      project: null,
      loading: false,
      error: null
    });
  }

  private getUninitializedError(): Error {
    return new Error('Service is not initialized. Call \'init\' method first');
  }
}
