import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { InfoBlockComponent, UserInfoComponent } from '@shared/ui';

import { TicketBrief } from '../../models';
import { TicketStatusComponent } from '../ticket-status';

@Component({
  selector: 'app-tickets-table',
  templateUrl: './tickets-table.component.html',
  styleUrl: './tickets-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    TicketStatusComponent,
    InfoBlockComponent,
    UserInfoComponent
  ]
})
export class TicketsTableComponent {
  readonly tickets = input.required<TicketBrief[]>();
  readonly totalCount = input.required<number>();
  readonly pageSize = input<number>(20);
  readonly pageIndex = input<number>(0);

  readonly rowClick = output<TicketBrief>();
  readonly pageChange = output<PageEvent>();

  protected readonly displayedColumns = ['title', 'status', 'assignee', 'createdAt', 'updatedAt'];


  protected onRowClick(ticket: TicketBrief): void {
    this.rowClick.emit(ticket);
  }

  protected onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }
}
