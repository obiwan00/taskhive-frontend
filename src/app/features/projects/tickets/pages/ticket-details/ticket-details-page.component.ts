import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';

import { catchError, debounceTime, EMPTY, filter, Subject, switchMap, tap } from 'rxjs';

import { AppNavRoutes } from '@core/navigation-routes';
import { ProjectAssignee, ProjectAssigneesStateService } from '@features/projects/assignees';
import { CanProjectPipe, ProjectPermission, ProjectStateService } from '@features/projects/project';
import { InvokePipe, ValidationMessagePipe } from '@shared/pipes';
import { ConfirmationDialogComponent, ConfirmDialogData, InfoBlockComponent, UserInfoComponent } from '@shared/ui';

import { TicketsApiService } from '../../api';
import { SaveStatusComponent, TicketStatusComponent } from '../../components';
import { TICKET_VALIDATION } from '../../constants';
import { TicketDetails, TicketStatus, UpdateTicket } from '../../models';

interface TicketDetailsState {
  ticket: TicketDetails | null;
  loading: boolean;
  updating: boolean;
  error: string | null;
}

@Component({
  selector: 'app-ticket-details-page',
  templateUrl: './ticket-details-page.component.html',
  styleUrl: './ticket-details-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    CdkTextareaAutosize,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    InfoBlockComponent,
    CanProjectPipe,
    SaveStatusComponent,
    TicketStatusComponent,
    ValidationMessagePipe,
    UserInfoComponent,
    InvokePipe
  ]
})
export class TicketDetailsPageComponent implements OnInit {
  private readonly ticketsApi = inject(TicketsApiService);
  private readonly projectStateService = inject(ProjectStateService);
  private readonly projectAssigneesStateService = inject(ProjectAssigneesStateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  private readonly updateTrigger$ = new Subject<UpdateTicket>();

  private readonly projectId = computed(() => {
    const id = this.route.snapshot.paramMap.get('projectId');
    if (!id) throw new Error('projectId route param is required');
    return id;
  });

  private readonly ticketId = computed(() => {
    const id = this.route.snapshot.paramMap.get('ticketId');
    if (!id) throw new Error('ticketId route param is required');
    return id;
  });

  protected readonly ProjectPermission = ProjectPermission;

  protected readonly saveStatus = signal<'saved' | 'error' | null>(null);
  protected readonly hasUnsavedChanges = signal(false);

  protected readonly ticketForm = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(TICKET_VALIDATION.TITLE_MIN_LENGTH),
        Validators.maxLength(TICKET_VALIDATION.TITLE_MAX_LENGTH)
      ]
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(TICKET_VALIDATION.DESCRIPTION_MIN_LENGTH),
        Validators.maxLength(TICKET_VALIDATION.DESCRIPTION_MAX_LENGTH)
      ]
    }),
    status: new FormControl<TicketStatus>(TicketStatus.Todo, {
      nonNullable: true,
      validators: [Validators.required]
    }),
    assigneeId: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  protected readonly state = signal<TicketDetailsState>({
    ticket: null,
    loading: false,
    updating: false,
    error: null
  });

  protected readonly ticket = computed(() => this.state().ticket);
  protected readonly loading = computed(() => this.state().loading);
  protected readonly updating = computed(() => this.state().updating);
  protected readonly error = computed(() => this.state().error);

  protected readonly projectRole = computed(() => this.projectStateService.project()?.myRole);

  protected readonly assignees = computed(() => this.projectAssigneesStateService.assignees());
  protected readonly assigneesLoading = computed(() => this.projectAssigneesStateService.loading());

  protected readonly statusOptions = Object.values(TicketStatus).map((value) => ({ value }));

  ngOnInit(): void {
    this.loadTicketDetails();
    this.loadProjectDetails();
    this.loadAssignees();

    this.subscribeForSavingUnsavedChanges();
    this.setupUpdateStream();
  }

  private setupUpdateStream(): void {
    this.updateTrigger$
      .pipe(
        tap(() => {
          this.state.update(s => ({ ...s, updating: true }));
          this.saveStatus.set(null);
        }),
        switchMap((updates) =>
          this.ticketsApi.update(this.projectId(), this.ticketId(), updates).pipe(
            catchError((error) => {
              this.snackBar.open('Failed to update ticket', 'Close');
              this.state.update(s => ({ ...s, updating: false }));
              this.saveStatus.set('error');
              return EMPTY;
            })
          )
        ),
        tap(() => {
          this.saveStatus.set('saved');
          this.hasUnsavedChanges.set(false);
        }),
        switchMap(() => this.ticketsApi.getDetails(this.projectId(), this.ticketId()).pipe(
          catchError((error) => {
            this.snackBar.open('Failed to load ticket after update', 'Close');
            this.state.update(s => ({ ...s, updating: false }));
            return EMPTY;
          })
        )),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((updatedTicket) => {
        this.state.update(s => ({ ...s, ticket: updatedTicket, updating: false }));

        this.ticketForm.markAsPristine();
        this.patchTicketForm(updatedTicket);
      });
  }

  private subscribeForSavingUnsavedChanges(): void {
    this.ticketForm.valueChanges
      .pipe(
        tap(() => {
          this.hasUnsavedChanges.set(this.ticketForm.dirty);
          if (this.saveStatus() !== null) {
            this.saveStatus.set(null);
          }
        }),
        debounceTime(1500),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.saveChanges();
      });
  }

  protected findAssignee(assignees: ProjectAssignee[], assigneeId: string): ProjectAssignee | undefined {
    return assignees?.find(a => a.userId === assigneeId);
  }

  protected saveChanges(): void {
    if (!this.ticketForm.valid || !this.hasUnsavedChanges()) return;

    const currentTicket = this.ticket();
    if (!currentTicket) return;

    const formValue = this.ticketForm.getRawValue();

    const updates: UpdateTicket = {};
    let hasChanges = false;

    if (formValue.title !== currentTicket.title) {
      updates.title = formValue.title;
      hasChanges = true;
    }

    if (formValue.description !== currentTicket.description) {
      updates.description = formValue.description;
      hasChanges = true;
    }

    if (formValue.status !== currentTicket.status) {
      updates.status = formValue.status;
      hasChanges = true;
    }

    if (formValue.assigneeId !== currentTicket.assignee.userId) {
      updates.assigneeId = formValue.assigneeId;
      hasChanges = true;
    }

    if (!hasChanges) {
      this.hasUnsavedChanges.set(false);
      this.ticketForm.markAsPristine();
      return;
    }

    this.updateTrigger$.next(updates);
  }

  protected onRetry(): void {
    this.saveChanges();
  }


  protected preventTitleNewLineOnKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  protected preventTitleNewLineOnPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const cleanedText = pastedText.replace(/[\r\n]+/g, ' ').trim();

    const control = this.ticketForm.controls.title;
    const currentValue = control.value;
    const textarea = event.target as HTMLTextAreaElement;
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;

    const newValue = currentValue.substring(0, start) + cleanedText + currentValue.substring(end);
    control.setValue(newValue);

    const newCursorPosition = start + cleanedText.length;
    setTimeout(() => {
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    });
  }

  protected onBackToProject(): void {
    this.router.navigate([AppNavRoutes.projects.board(this.projectId())]);
  }

  protected onDelete(): void {
    const ticket = this.ticket();
    if (!ticket) return;

    const dialogRef = this.dialog.open<ConfirmationDialogComponent, ConfirmDialogData, boolean>(
      ConfirmationDialogComponent,
      {
        width: '400px',
        data: {
          title: 'Delete Ticket',
          message: `Are you sure you want to delete "${ticket.title}"? This action cannot be undone.`,
          confirmText: 'Delete',
          cancelText: 'Cancel'
        }
      }
    );

    dialogRef.afterClosed()
      .pipe(
        filter((confirmed): confirmed is true => !!confirmed),
        tap(() => this.state.update(s => ({ ...s, updating: true }))),
        switchMap(() => this.ticketsApi.delete(this.projectId(), this.ticketId())),
        catchError(error => {
          this.snackBar.open('Failed to delete ticket', 'Close');
          this.state.update(s => ({ ...s, updating: false }));
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.snackBar.open('Ticket deleted successfully', 'Close');
        this.router.navigate([AppNavRoutes.projects.board(this.projectId())]);
      });
  }


  private loadTicketDetails(): void {
    this.state.update(s => ({ ...s, loading: true, error: null }));

    this.ticketsApi.getDetails(this.projectId(), this.ticketId())
      .pipe(
        catchError(error => {
          this.state.update(s => ({
            ...s,
            loading: false,
            error: error.status === 404 ? 'Ticket not found' : 'Failed to load ticket details'
          }));
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(ticket => {
        this.state.set({
          ticket,
          loading: false,
          updating: false,
          error: null
        });

        this.patchTicketForm(ticket);
        this.ticketForm.markAsPristine();
        this.hasUnsavedChanges.set(false);
      });
  }

  private loadAssignees(): void {
    this.projectAssigneesStateService.init(this.projectId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err) => {
          console.error('Error loading assignees:', err);
          this.snackBar.open('Failed to load assignees', 'Close');
        }
      });
  }

  private loadProjectDetails(): void {
    this.projectStateService.init(this.projectId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err) => {
          this.router.navigate([AppNavRoutes.projects.list]);
          this.snackBar.open('Failed to load project details. Please try again', 'Close');
          console.error('Error loading project details:', err);
        }
      });
  }

  private patchTicketForm(ticket: TicketDetails, emitEvent = false): void {
    this.ticketForm.patchValue({
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      assigneeId: ticket.assignee.userId
    }, { emitEvent });
  }
}

