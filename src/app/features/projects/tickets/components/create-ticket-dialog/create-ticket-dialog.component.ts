import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';


import { ProjectAssignee } from '@features/projects/assignees';
import { ValidationMessagePipe } from '@shared/pipes';

import { TICKET_VALIDATION } from '../../constants';
import { CreateTicket } from '../../models';

export interface CreateTicketDialogData {
  assignees: ProjectAssignee[];
}

@Component({
  selector: 'app-create-ticket-dialog',
  templateUrl: './create-ticket-dialog.component.html',
  styleUrl: './create-ticket-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ValidationMessagePipe
  ]
})
export class CreateTicketDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateTicketDialogComponent>);
  private readonly data = inject<CreateTicketDialogData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);

  protected readonly assignees = this.data.assignees;

  protected readonly form = this.fb.group({
    title: [
      '',
      [
        Validators.required,
        Validators.minLength(TICKET_VALIDATION.TITLE_MIN_LENGTH),
        Validators.maxLength(TICKET_VALIDATION.TITLE_MAX_LENGTH)
      ]
    ],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(TICKET_VALIDATION.DESCRIPTION_MIN_LENGTH),
        Validators.maxLength(TICKET_VALIDATION.DESCRIPTION_MAX_LENGTH)
      ]
    ],
    assigneeId: ['', [Validators.required]]
  });

  protected onCreate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const createData: CreateTicket = {
      title: this.form.value.title!,
      description: this.form.value.description!,
      assigneeId: this.form.value.assigneeId!
    };

    this.dialogRef.close(createData);
  }

  protected onCancel(): void {
    this.dialogRef.close();
  }
}
