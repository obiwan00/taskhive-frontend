import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ProjectDetails } from '../../models';
import { CanProjectPipe, ProjectPermission } from '../../permissions';
import { ProjectRoleComponent } from '../project-role';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    ProjectRoleComponent,
    CanProjectPipe
  ]
})
export class ProjectCardComponent {
  readonly project = input.required<ProjectDetails>();

  readonly manageMembersClick = output<void>();
  readonly editClick = output<void>();
  readonly deleteClick = output<void>();

  protected readonly ProjectPermission = ProjectPermission;


  protected onManageMembersClick(): void {
    this.manageMembersClick.emit();
  }

  protected onEditClick(): void {
    this.editClick.emit();
  }

  protected onDeleteClick(): void {
    this.deleteClick.emit();
  }
}
