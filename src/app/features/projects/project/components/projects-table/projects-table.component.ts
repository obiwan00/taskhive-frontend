import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { InfoBlockComponent } from '@shared/ui';

import { ProjectBrief } from '../../models';
import { ProjectRoleComponent } from '../project-role';


@Component({
  selector: 'app-projects-table',
  templateUrl: './projects-table.component.html',
  styleUrl: './projects-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    ProjectRoleComponent,
    InfoBlockComponent
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

  protected onRowClick(project: ProjectBrief): void {
    this.rowClick.emit(project);
  }

  protected onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }
}

