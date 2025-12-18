import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

import { InfoBlockComponent } from '@shared/components';

import { ProjectsApiService } from '../../api/projects-api.service';
import { ProjectsFiltersComponent, ProjectsFilterQuery } from '../../components/projects-filters';
import { ProjectsTableComponent } from '../../components/projects-table';
import { GetProjectsQuery, ProjectBrief } from '../../models';

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
  private readonly destroyRef = inject(DestroyRef);

  private readonly state = signal<ProjectsState>({
    projects: [],
    totalCount: 0,
    loading: false,
    error: null
  });

  protected readonly projects = computed(() => this.state().projects);
  protected readonly totalCount = computed(() => this.state().totalCount);
  protected readonly loading = computed(() => this.state().loading);
  protected readonly error = computed(() => this.state().error);

  private readonly currentFilters = signal<ProjectsFilterQuery>({});
  private readonly currentPage = signal(0);
  private readonly currentPageSize = signal(20);

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
            error: 'Failed to load projects. Please try again.'
          }));
          console.error('Error loading projects:', err);
        }
      });
  }
}

