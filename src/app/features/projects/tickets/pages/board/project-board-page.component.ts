import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { filter, switchMap } from 'rxjs/operators';

import { ProjectAssigneesStateService } from '@features/projects/assignees';
import {
  CanProjectPipe,
  ProjectCardComponent,
  ProjectDialogComponent,
  ProjectDialogData,
  ProjectPermission,
  ProjectsApiService,
  ProjectStateService,
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

interface BoardTicketsState {
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
    TicketsTableComponent,
    CanProjectPipe
  ]
})
export class ProjectBoardPageComponent implements OnInit {
  private readonly projectsApi = inject(ProjectsApiService);
  private readonly ticketsApi = inject(TicketsApiService);
  private readonly projectStateService = inject(ProjectStateService);
  private readonly projectAssigneesStateService = inject(ProjectAssigneesStateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  private readonly projectId = computed(() => {
    const id = this.route.snapshot.paramMap.get('projectId');
    if (!id) throw new Error('projectId route param is required');
    return id;
  });

  private readonly ticketsQuery = computed<GetTicketsQuery>(() => ({
    page: this.currentPage() + 1,
    pageSize: this.currentPageSize(),
    search: this.currentFilters().search,
    status: this.currentFilters().status?.toString(),
    assigneeId: this.currentFilters().assigneeId,
  }));

  protected readonly ProjectPermission = ProjectPermission;

  protected readonly ticketsState = signal<BoardTicketsState>({
    tickets: [],
    totalCount: 0,
    loading: false,
    error: null
  });

  private readonly currentFilters = signal<TicketsFilterQuery>({});
  protected readonly currentPage = signal(0);
  protected readonly currentPageSize = signal(20);

  protected readonly projectDetails = computed(() => this.projectStateService.project());
  protected readonly projectDetailsLoading = computed(() => this.projectStateService.loading());

  protected readonly assignees = computed(() => this.projectAssigneesStateService.assignees());
  protected readonly assigneesLoading = computed(() => this.projectAssigneesStateService.loading());

  ngOnInit(): void {
    this.loadProjectDetails();
    this.loadAssignees();
    this.loadTickets();
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
    this.router.navigate(['/app/projects', this.projectId(), 'tickets', ticket.id]);
  }

  protected onManageMembersClick(): void {
    this.router.navigate(['/app/projects', this.projectId(), 'members']);
  }

  protected onProjectEditClick(): void {
    const project = this.projectDetails();

    if (!project) return;

    const dialogRef = this.dialog.open<ProjectDialogComponent, ProjectDialogData, UpdateProject>(
      ProjectDialogComponent,
      {
        width: '500px',
        data: { project }
      }
    );

    dialogRef.afterClosed()
      .pipe(
        filter(v => !!v),
        switchMap((result) => this.projectStateService.update(result)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected onCreateTicketClick(): void {
    const assignees = this.assignees();

    if (!assignees) return;

    const dialogRef = this.dialog.open<CreateTicketDialogComponent, CreateTicketDialogData, CreateTicket>(
      CreateTicketDialogComponent,
      {
        width: '500px',
        data: { assignees }
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

  protected onProjectDeleteClick(): void {
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

  private loadProjectDetails(): void {
    this.projectStateService.init(this.projectId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err) => {
          this.router.navigate(['/app/projects/list']);
          this.snackBar.open('Failed to load project details. Please try again', 'Close');
          console.error('Error loading project details:', err);
        }
      });
  }

  private loadTickets(): void {
    const query = this.ticketsQuery();

    this.ticketsState.update(state => ({ ...state, loading: true, error: null }));

    this.ticketsApi.getPagedList(this.projectId(), query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.ticketsState.update(state => ({
            ...state,
            loading: false,
            tickets: result.items,
            totalCount: result.pagination.totalCount
          }));
        },
        error: (err) => {
          console.error('Error loading tickets:', err);
          this.ticketsState.update(() => ({
            tickets: [],
            totalCount: 0,
            loading: false,
            error: 'Failed to load tickets. Please try again later',
          }));
        }
      });
  }

  private loadAssignees() {
    this.projectAssigneesStateService.init(this.projectId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err) => {
          console.error('Error loading assignees:', err);
          this.snackBar.open('Failed to load assignees. Please try again later', 'Close');
        }
      });
  }

  private createTicket(data: CreateTicket): void {
    this.ticketsApi.create(this.projectId(), data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (ticket) => {
          this.openCreateTicketNotification(ticket.id);
        },
        error: (err) => {
          console.error('Error creating ticket:', err);
          this.snackBar.open('Failed to create ticket. Please try again', 'Close');
        }
      });
  }

  private deleteProject(): void {
    this.projectsApi.delete(this.projectId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/app/projects']);
          this.snackBar.open('Project deleted successfully', 'Close');
        },
        error: (err) => {
          console.error('Error deleting project:', err);
          this.snackBar.open('Failed to delete project. Please try again', 'Close');
        }
      });
  }

  private openCreateTicketNotification(ticketId: string) {
    const snackBarRef = this.snackBar.open('Ticket created successfully', 'Open');

    snackBarRef.onAction()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.router.navigate(['/app/projects', this.projectId(), 'tickets', ticketId]);
      });
  }
}


