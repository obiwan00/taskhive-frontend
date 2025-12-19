import { PaginationQuery } from '@shared/models';

import { TicketStatus } from './ticket-status.model';


export interface GetMyTicketsQuery extends PaginationQuery {
  search?: string;
  status?: string;
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
