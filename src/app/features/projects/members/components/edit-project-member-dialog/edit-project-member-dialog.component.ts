import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ProjectRole, ProjectRoleComponent } from '@features/projects/project';
import { ValidationMessagePipe } from '@shared/pipes';
import { CopyTextComponent } from '@shared/ui';

import { ProjectMember, UpdateProjectMember } from '../../models';

export interface EditProjectMemberDialogData {
  member: ProjectMember;
}

@Component({
  selector: 'app-edit-project-member-dialog',
  templateUrl: './edit-project-member-dialog.component.html',
  styleUrl: './edit-project-member-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ValidationMessagePipe,
    ProjectRoleComponent,
    CopyTextComponent
  ]
})
export class EditProjectMemberDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<EditProjectMemberDialogComponent>);
  private readonly data = inject<EditProjectMemberDialogData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);

  protected readonly member = this.data.member;

  protected readonly roles = Object.values(ProjectRole).map((value) => ({ value }));

  protected readonly form = this.fb.group({
    role: this.fb.nonNullable.control<ProjectRole>(this.member.role, [Validators.required])
  });

  protected onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const updateData: UpdateProjectMember = {
      role: formValue.role
    };

    this.dialogRef.close(updateData);
  }

  protected onCancel(): void {
    this.dialogRef.close();
  }
}

