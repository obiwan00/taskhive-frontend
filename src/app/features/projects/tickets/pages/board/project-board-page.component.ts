import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { forkJoin } from 'rxjs';

import {
  ProjectAssignee,
  ProjectCardComponent,
  ProjectDetails,
  ProjectDialogComponent,
  ProjectDialogData,
  ProjectsApiService,
  UpdateProject
} from '@features/projects/project';
import { ConfirmationDialogComponent, ConfirmDialogData, InfoBlockComponent } from '@shared/ui';

import { TicketsApiService } from '../../api';
import {
  CreateTicketDialogComponent,
  CreateTicketDialogData,
  TicketsFilterQuery,
  TicketsFiltersComponent,
  TicketsTableComponent
} from '../../components';
import { CreateTicket, GetTicketsQuery, TicketBrief } from '../../models';

interface BoardState {
  project: ProjectDetails | null;
  assignees: ProjectAssignee[];
  tickets: TicketBrief[];
  totalCount: number;
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-project-board-page',
  templateUrl: './project-board-page.component.html',
  styleUrl: './project-board-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    InfoBlockComponent,
    ProjectCardComponent,
    TicketsFiltersComponent,
    TicketsTableComponent
  ]
})
export class ProjectBoardPageComponent {
  private readonly projectsApi = inject(ProjectsApiService);
  private readonly ticketsApi = inject(TicketsApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  private readonly projectId = this.route.snapshot.paramMap.get('projectId') || '';

  private readonly state = signal<BoardState>({
    project: null,
    assignees: [],
    tickets: [],
    totalCount: 0,
    loading: false,
    error: null
  });

  protected readonly project = computed(() => this.state().project);
  protected readonly assignees = computed(() => this.state().assignees);
  protected readonly tickets = computed(() => this.state().tickets);
  protected readonly totalCount = computed(() => this.state().totalCount);
  protected readonly loading = computed(() => this.state().loading);
  protected readonly error = computed(() => this.state().error);

  private readonly currentFilters = signal<TicketsFilterQuery>({});
  protected readonly currentPage = signal(0);
  protected readonly currentPageSize = signal(20);

  constructor() {
    this.loadInitialData();
  }

  protected onFilterChange(filters: TicketsFilterQuery): void {
    this.currentFilters.set(filters);
    this.currentPage.set(0);
    this.loadTickets();
  }

  protected onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.currentPageSize.set(event.pageSize);
    this.loadTickets();
  }

  protected onTicketRowClick(ticket: TicketBrief): void {
    this.router.navigate(['/app/projects', this.projectId, 'tickets', ticket.id]);
  }

  protected onManageMembersClick(): void {
    this.router.navigate(['/app/projects', this.projectId, 'members']);
  }

  protected onEditClick(): void {
    const project = this.state().project;
    if (!project) return;

    const dialogRef = this.dialog.open<ProjectDialogComponent, ProjectDialogData, UpdateProject>(
      ProjectDialogComponent,
      {
        width: '500px',
        data: { project }
      }
    );

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result) {
          this.updateProject(result);
        }
      });
  }

  protected onCreateTicketClick(): void {
    const dialogRef = this.dialog.open<CreateTicketDialogComponent, CreateTicketDialogData, CreateTicket>(
      CreateTicketDialogComponent,
      {
        width: '500px',
        data: { assignees: this.state().assignees }
      }
    );

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result) {
          this.createTicket(result);
        }
      });
  }

  protected onDeleteClick(): void {
    const dialogRef = this.dialog.open<ConfirmationDialogComponent, ConfirmDialogData, boolean>(
      ConfirmationDialogComponent,
      {
        width: '400px',
        data: {
          title: 'Delete Project',
          message: 'Are you sure you want to delete this project? This action cannot be undone and will delete all associated tickets.',
          confirmText: 'Delete',
          cancelText: 'Cancel'
        }
      }
    );

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(confirmed => {
        if (confirmed) {
          this.deleteProject();
        }
      });
  }

  private loadInitialData(): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));

    forkJoin({
      project: this.projectsApi.getDetails(this.projectId),
      assignees: this.projectsApi.getAssignees(this.projectId)
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ project, assignees }) => {
          this.state.update(state => ({
            ...state,
            project,
            assignees: assignees.items,
            loading: false
          }));
          this.loadTickets();
        },
        error: (err) => {
          this.state.update(state => ({
            ...state,
            loading: false,
            error: 'Failed to load project details. Please try again.'
          }));
          console.error('Error loading project details:', err);
        }
      });
  }

  private loadTickets(): void {
    const query: GetTicketsQuery = {
      page: this.currentPage() + 1,
      pageSize: this.currentPageSize(),
      search: this.currentFilters().search,
      status: this.currentFilters().status?.toString(),
      assigneeId: this.currentFilters().assigneeId,
    };

    this.ticketsApi.getPagedList(this.projectId, query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.state.update(state => ({
            ...state,
            tickets: result.items,
            totalCount: result.pagination.totalCount
          }));
        },
        error: (err) => {
          console.error('Error loading tickets:', err);
        }
      });
  }

  private updateProject(data: UpdateProject): void {
    this.projectsApi.update(this.projectId, data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedProject) => {
          this.state.update(state => ({
            ...state,
            project: updatedProject
          }));
        },
        error: (err) => {
          console.error('Error updating project:', err);
          this.snackBar.open('Failed to update project. Please try again.', 'Close', { duration: 5000 });
        }
      });
  }

  private createTicket(data: CreateTicket): void {
    this.ticketsApi.create(this.projectId, data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loadTickets();
        },
        error: (err) => {
          console.error('Error creating ticket:', err);
          this.snackBar.open('Failed to create ticket. Please try again.', 'Close', { duration: 5000 });
        }
      });
  }

  private deleteProject(): void {
    this.projectsApi.delete(this.projectId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/app/projects']);
        },
        error: (err) => {
          console.error('Error deleting project:', err);
          this.snackBar.open('Failed to delete project. Please try again.', 'Close', { duration: 5000 });
        }
      });
  }
}


