import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ChipColor, ChipComponent } from '@shared/ui';

import { PROJECT_ROLE_LABELS, ProjectRole } from '../../models';


const PROJECT_ROLE_COLORS: Record<ProjectRole, ChipColor> = {
  [ProjectRole.Owner]: 'purple',
  [ProjectRole.Member]: 'green',
  [ProjectRole.Viewer]: 'gray',
};

@Component({
  selector: 'app-project-role',
  imports: [ChipComponent],
  templateUrl: './project-role.component.html',
  styleUrl: './project-role.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectRoleComponent {
  role = input.required<ProjectRole>();

  protected chipColor = computed(() => PROJECT_ROLE_COLORS[this.role()]);
  protected roleLabel = computed(() => PROJECT_ROLE_LABELS[this.role()]);
}

