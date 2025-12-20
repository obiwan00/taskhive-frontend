import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ValidationMessagePipe } from '@shared/pipes';

import { PROJECT_VALIDATION } from '../../constants';
import { CreateProject, ProjectDetails, UpdateProject } from '../../models';

export interface ProjectDialogData {
  project?: ProjectDetails;
}

@Component({
  selector: 'app-project-dialog',
  templateUrl: './project-dialog.component.html',
  styleUrl: './project-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ValidationMessagePipe
  ]
})
export class ProjectDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ProjectDialogComponent>);
  private readonly data = inject<ProjectDialogData | null>(MAT_DIALOG_DATA, { optional: true });
  private readonly fb = inject(FormBuilder);

  protected readonly isEditMode = !!this.data?.project;
  protected readonly dialogTitle = this.isEditMode ? 'Edit Project' : 'Create Project';

  protected readonly form = this.fb.group({
    title: this.fb.nonNullable.control(
      this.data?.project?.title || '',
      [
        Validators.required,
        Validators.minLength(PROJECT_VALIDATION.TITLE_MIN_LENGTH),
        Validators.maxLength(PROJECT_VALIDATION.TITLE_MAX_LENGTH)
      ]
    ),
    description: this.fb.nonNullable.control(
      this.data?.project?.description || '',
      [
        Validators.required,
        Validators.minLength(PROJECT_VALIDATION.DESCRIPTION_MIN_LENGTH),
        Validators.maxLength(PROJECT_VALIDATION.DESCRIPTION_MAX_LENGTH)
      ]
    )
  });

  protected onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEditMode) {
      this.saveUpdate();
    } else {
      this.saveCreate();
    }
  }

  protected onCancel(): void {
    this.dialogRef.close();
  }

  private saveUpdate(): void {
    const formValue = this.form.getRawValue();

    this.dialogRef.close({
      title: formValue.title || undefined,
      description: formValue.description || undefined
    });
  }

  private saveCreate(): void {
    const formValue = this.form.getRawValue();

    this.dialogRef.close(formValue);
  }
}
