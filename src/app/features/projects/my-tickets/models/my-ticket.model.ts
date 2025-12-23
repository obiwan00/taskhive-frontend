import { TicketStatus } from '@features/projects/tickets';
import { PaginationQuery } from '@shared/models';

export interface GetMyTicketsQuery extends PaginationQuery {
  search?: string;
  status?: TicketStatus;
}

export interface MyTicket {
  id: string;
  title: string;
  project: MyTicketProject;
  status: TicketStatus;
  createdAtUtc: string;
  updatedAtUtc: string | null;
}

export interface MyTicketProject {
  id: string;
  title: string;
}
