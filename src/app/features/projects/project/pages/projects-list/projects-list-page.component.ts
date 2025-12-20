import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { InfoBlockComponent } from '@shared/ui';

import { ProjectsApiService } from '../../api';
import {
  ProjectDialogComponent,
  ProjectDialogData,
  ProjectsFiltersComponent,
  ProjectsFilterQuery,
  ProjectsTableComponent
} from '../../components';
import { CreateProject, GetProjectsQuery, ProjectBrief } from '../../models';

interface ProjectsState {
  projects: ProjectBrief[];
  totalCount: number;
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-projects-list-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    InfoBlockComponent,
    ProjectsFiltersComponent,
    ProjectsTableComponent
  ],
  templateUrl: './projects-list-page.component.html',
  styleUrl: './projects-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsListPageComponent {
  private readonly projectsApi = inject(ProjectsApiService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  private readonly state = signal<ProjectsState>({
    projects: [],
    totalCount: 0,
    loading: false,
    error: null
  });

  private readonly currentFilters = signal<ProjectsFilterQuery>({});

  protected readonly projects = computed(() => this.state().projects);
  protected readonly totalCount = computed(() => this.state().totalCount);
  protected readonly loading = computed(() => this.state().loading);
  protected readonly error = computed(() => this.state().error);

  protected readonly currentPage = signal(0);
  protected readonly currentPageSize = signal(20);

  constructor() {
    this.loadProjects();
  }

  protected onFilterChange(filters: ProjectsFilterQuery): void {
    this.currentFilters.set(filters);
    this.currentPage.set(0);
    this.loadProjects();
  }

  protected onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.currentPageSize.set(event.pageSize);
    this.loadProjects();
  }

  protected onRowClick(project: ProjectBrief): void {
    this.router.navigate(['/app/projects', project.id, 'board']);
  }

  protected onCreateProject(): void {
    const dialogRef = this.dialog.open<ProjectDialogComponent, ProjectDialogData, CreateProject>(
      ProjectDialogComponent,
      {
        width: '500px',
        data: {}
      }
    );

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result) {
          this.createProject(result);
        }
      });
  }

  private loadProjects(): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));

    const query: GetProjectsQuery = {
      page: this.currentPage() + 1,
      pageSize: this.currentPageSize(),
      search: this.currentFilters().search,
      role: this.currentFilters().role
    };

    this.projectsApi.getPagedList(query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.state.set({
            projects: result.items,
            totalCount: result.pagination.totalCount,
            loading: false,
            error: null
          });
        },
        error: (err) => {
          this.state.update(state => ({
            ...state,
            loading: false,
            error: 'Failed to load projects. Please try again'
          }));
          console.error('Error loading projects:', err);
          this.snackBar.open('Failed to load project. Please try again', 'Close', { duration: 5000 });
        }
      });
  }

  private createProject(data: CreateProject): void {
    this.projectsApi.create(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (project: ProjectBrief) => {
          this.router.navigate(['/app/projects', project.id, 'board']);
        },
        error: (err: unknown) => {
          console.error('Error creating project:', err);
          this.snackBar.open('Failed to create project. Please try again', 'Close', { duration: 5000 });
        }
      });
  }
}

