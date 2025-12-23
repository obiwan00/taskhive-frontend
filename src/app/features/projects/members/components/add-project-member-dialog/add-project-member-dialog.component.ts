import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { ProjectRole, ProjectRoleComponent } from '@features/projects/project';
import { ValidationMessagePipe } from '@shared/pipes';

import { AddProjectMember } from '../../models';

@Component({
  selector: 'app-add-project-member-dialog',
  templateUrl: './add-project-member-dialog.component.html',
  styleUrl: './add-project-member-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ValidationMessagePipe,
    ProjectRoleComponent
  ]
})
export class AddProjectMemberDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AddProjectMemberDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly ProjectRole = ProjectRole;

  protected readonly roles = Object.values(ProjectRole).map((value) => ({ value }));

  protected readonly form = this.fb.group({
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    role: this.fb.nonNullable.control<ProjectRole | null>(null, [Validators.required])
  });

  protected onAdd(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    if (!formValue.role) return;

    const addData: AddProjectMember = {
      email: formValue.email,
      role: formValue.role
    };

    this.dialogRef.close(addData);
  }

  protected onCancel(): void {
    this.dialogRef.close();
  }
}

