import { ChangeDetectionStrategy, Component, DestroyRef, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { debounceTime, distinctUntilChanged } from 'rxjs';

import { ValidationMessagePipe } from '@shared/pipes';

import { PROJECT_ROLE_LABELS, ProjectRole } from '../../models';


export interface ProjectsFilterQuery {
  search?: string;
  role?: ProjectRole;
}

@Component({
  selector: 'app-projects-filters',
  templateUrl: './projects-filters.component.html',
  styleUrl: './projects-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ValidationMessagePipe
  ]
})
export class ProjectsFiltersComponent {
  private readonly destroyRef = inject(DestroyRef);

  readonly filterChange = output<ProjectsFilterQuery>();

  protected readonly searchControl = new FormControl('', {
    validators: [Validators.maxLength(100)]
  });
  protected readonly roleControl = new FormControl<ProjectRole | null>(null);

  protected readonly availableRoles = [
    { value: ProjectRole.Owner, label: PROJECT_ROLE_LABELS[ProjectRole.Owner] },
    { value: ProjectRole.Member, label: PROJECT_ROLE_LABELS[ProjectRole.Member] },
    { value: ProjectRole.Viewer, label: PROJECT_ROLE_LABELS[ProjectRole.Viewer] }
  ];

  constructor() {
    this.subscribeToSearchChanges();
    this.subscribeToRoleChanges();
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

  private subscribeToRoleChanges(): void {
    this.roleControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.emitFilterChange());
  }

  private emitFilterChange(): void {
    if (this.searchControl.valid) {
      this.filterChange.emit({
        search: this.searchControl.value || undefined,
        role: this.roleControl.value || undefined
      });
    }
  }
}

