import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { InfoBlockComponent } from '@shared/ui';

import { MyTicketsApiService } from '../../api';
import { MyTicketsFilterQuery, MyTicketsFiltersComponent, MyTicketsTableComponent } from '../../components';
import { GetMyTicketsQuery, MyTicket } from '../../models';


interface MyTicketsState {
  tickets: MyTicket[];
  totalCount: number;
  loading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-my-ticket-page',
  templateUrl: './my-tickets-page.component.html',
  styleUrl: './my-tickets-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatProgressSpinnerModule,
    InfoBlockComponent,
    MyTicketsFiltersComponent,
    MyTicketsTableComponent
  ]
})
export class MyTicketsPageComponent {
  private readonly myTicketsApi = inject(MyTicketsApiService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  private readonly state = signal<MyTicketsState>({
    tickets: [],
    totalCount: 0,
    loading: false,
    error: null
  });

  private readonly currentFilters = signal<MyTicketsFilterQuery>({});

  protected readonly tickets = computed(() => this.state().tickets);
  protected readonly totalCount = computed(() => this.state().totalCount);
  protected readonly loading = computed(() => this.state().loading);
  protected readonly error = computed(() => this.state().error);

  protected readonly currentPage = signal(0);
  protected readonly currentPageSize = signal(20);

  constructor() {
    this.loadTickets();
  }

  protected onFilterChange(filters: MyTicketsFilterQuery): void {
    this.currentFilters.set(filters);
    this.currentPage.set(0);
    this.loadTickets();
  }

  protected onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.currentPageSize.set(event.pageSize);
    this.loadTickets();
  }

  protected onRowClick(ticket: MyTicket): void {
    this.router.navigate(['/app/projects', ticket.project.id, 'tickets', ticket.id]);
  }

  private loadTickets(): void {
    this.state.update(state => ({ ...state, loading: true, error: null }));

    const query: GetMyTicketsQuery = {
      page: this.currentPage() + 1,
      pageSize: this.currentPageSize(),
      search: this.currentFilters().search,
      status: this.currentFilters().status
    };

    this.myTicketsApi.getPagedList(query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.state.set({
            tickets: result.items,
            totalCount: result.pagination.totalCount,
            loading: false,
            error: null
          });
        },
        error: (err) => {
          this.state.update(state => ({
            ...state,
            loading: false,
            error: 'Failed to load tickets. Please try again'
          }));
          console.error('Error loading my tickets:', err);
          this.snackBar.open('Failed to load tickets. Please try again', 'Close');
        }
      });
  }
}
