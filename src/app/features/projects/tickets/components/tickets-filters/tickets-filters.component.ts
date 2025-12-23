import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import { ProjectAssignee } from '@features/projects/assignees';
import { ValidationMessagePipe } from '@shared/pipes';
import { UserInfoComponent } from '@shared/ui';

import { TICKET_STATUS_LABELS, TicketStatus } from '../../models';
import { TicketStatusComponent } from '../ticket-status';

export interface TicketsFilterQuery {
  search?: string;
  status?: TicketStatus;
  assigneeId?: string;
}

@Component({
  selector: 'app-tickets-filters',
  templateUrl: './tickets-filters.component.html',
  styleUrl: './tickets-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    ValidationMessagePipe,
    UserInfoComponent,
    TicketStatusComponent,
  ]
})
export class TicketsFiltersComponent {
  private readonly destroyRef = inject(DestroyRef);

  readonly assignees = input.required<ProjectAssignee[] | null>();
  readonly assigneesLoading = input<boolean>(false);
  readonly filterChange = output<TicketsFilterQuery>();

  readonly selectedAssignee = signal<ProjectAssignee | null>(null);

  protected readonly searchControl = new FormControl('', {
    validators: [Validators.maxLength(100)]
  });
  protected readonly statusControl = new FormControl<TicketStatus | null>(null);
  protected readonly assigneeControl = new FormControl<string | null>(null);

  protected readonly availableStatuses = [
    { value: TicketStatus.Todo, label: TICKET_STATUS_LABELS[TicketStatus.Todo] },
    { value: TicketStatus.InProgress, label: TICKET_STATUS_LABELS[TicketStatus.InProgress] },
    { value: TicketStatus.Done, label: TICKET_STATUS_LABELS[TicketStatus.Done] }
  ];

  constructor() {
    this.subscribeToSearchChanges();
    this.subscribeToStatusChanges();
    this.subscribeToAssigneeChanges();
  }

  protected clearSearch(): void {
    this.searchControl.setValue('');
  }

  private subscribeToSearchChanges(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.emitFilterChange());
  }

  private subscribeToStatusChanges(): void {
    this.statusControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitFilterChange());
  }

  private subscribeToAssigneeChanges(): void {
    this.assigneeControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.emitFilterChange();
        this.updateCurrentAssignee();
      });
  }

  private emitFilterChange(): void {
    if (this.searchControl.valid) {
      this.filterChange.emit({
        search: this.searchControl.value || undefined,
        status: this.statusControl.value ?? undefined,
        assigneeId: this.assigneeControl.value || undefined
      });
    }
  }

  protected updateCurrentAssignee(): void {
    const assigneeId = this.assigneeControl.value;
    const selectedAssignee = this.assignees()?.find(a => a.userId === assigneeId) ?? null;

    this.selectedAssignee.set(selectedAssignee);
  }
}
