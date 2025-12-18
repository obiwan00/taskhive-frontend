import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { PROJECT_ROLE_LABELS, ProjectRole } from '@core/models';
import { ChipComponent, ChipType } from '@shared/components';
import { InvokePipe } from '@shared/pipes';

import { ProjectBrief } from '../../models';

export const PROJECT_ROLE_COLORS: Record<ProjectRole, ChipType> = {
  [ProjectRole.Owner]: 'purple',
  [ProjectRole.Member]: 'green',
  [ProjectRole.Viewer]: 'gray',
};

@Component({
  selector: 'app-projects-table',
  templateUrl: './projects-table.component.html',
  styleUrl: './projects-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    MatTableModule,
    MatPaginatorModule,
    ChipComponent,
    InvokePipe
  ]
})
export class ProjectsTableComponent {
  readonly projects = input.required<ProjectBrief[]>();
  readonly totalCount = input.required<number>();
  readonly pageSize = input<number>(20);
  readonly pageIndex = input<number>(0);

  readonly rowClick = output<ProjectBrief>();
  readonly pageChange = output<PageEvent>();

  protected readonly displayedColumns = ['project', 'role', 'createdAt', 'updatedAt'];

  protected readonly getRoleLabel = (role: ProjectRole): string => {
    return PROJECT_ROLE_LABELS[role] || 'Unknown';
  };

  protected readonly getRoleColor = (role: ProjectRole): ChipType => {
    return PROJECT_ROLE_COLORS[role] || 'gray';
  };

  protected onRowClick(project: ProjectBrief): void {
    this.rowClick.emit(project);
  }

  protected onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }
}

