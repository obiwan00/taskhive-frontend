import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { TicketStatusComponent } from '@features/projects/tickets';
import { InfoBlockComponent } from '@shared/ui';

import { MyTicket } from '../../models';

@Component({
  selector: 'app-my-tickets-table',
  templateUrl: './my-tickets-table.component.html',
  styleUrl: './my-tickets-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    MatTableModule,
    MatPaginatorModule,
    RouterLink,
    TicketStatusComponent,
    InfoBlockComponent
  ]
})
export class MyTicketsTableComponent {
  readonly tickets = input.required<MyTicket[]>();
  readonly totalCount = input.required<number>();
  readonly pageSize = input<number>(20);
  readonly pageIndex = input<number>(0);

  readonly rowClick = output<MyTicket>();
  readonly pageChange = output<PageEvent>();

  protected readonly displayedColumns = ['title', 'project', 'status', 'createdAt', 'updatedAt'];

  protected onRowClick(ticket: MyTicket): void {
    this.rowClick.emit(ticket);
  }

  protected onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }
}

