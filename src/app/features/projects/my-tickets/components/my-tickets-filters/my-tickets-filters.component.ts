import { ChangeDetectionStrategy, Component, DestroyRef, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import { TicketStatus, TicketStatusComponent } from '@features/projects/tickets';
import { ValidationMessagePipe } from '@shared/pipes';


export interface MyTicketsFilterQuery {
  search?: string;
  status?: TicketStatus;
}

@Component({
  selector: 'app-my-tickets-filters',
  templateUrl: './my-tickets-filters.component.html',
  styleUrl: './my-tickets-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ValidationMessagePipe,
    TicketStatusComponent
  ]
})
export class MyTicketsFiltersComponent {
  private readonly destroyRef = inject(DestroyRef);

  readonly filterChange = output<MyTicketsFilterQuery>();

  protected readonly searchControl = new FormControl('', {
    validators: [Validators.maxLength(100)]
  });
  protected readonly statusControl = new FormControl<TicketStatus | null>(null);

  protected readonly availableStatuses = Object.values(TicketStatus).map((value) => ({ value }));

  constructor() {
    this.subscribeToSearchChanges();
    this.subscribeToStatusChanges();
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

  private emitFilterChange(): void {
    if (this.searchControl.valid) {
      this.filterChange.emit({
        search: this.searchControl.value || undefined,
        status: this.statusControl.value || undefined
      });
    }
  }
}

