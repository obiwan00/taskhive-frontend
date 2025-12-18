import { PaginationQuery, TicketStatus } from '@core/models';

export interface GetTicketsQuery extends PaginationQuery {
  search?: string;
  status?: string;
}

export interface CreateTicket {
  title: string;
  description: string;
  assigneeId: string;
}

export interface UpdateTicket {
  title?: string;
  description?: string;
  status?: number;
  assigneeId?: string;
}

export interface TicketAssignee {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface TicketBrief {
  id: string;
  title: string;
  status: TicketStatus;
  assignee: TicketAssignee;
  createdAtUtc: string;
  updatedAtUtc: string | null;
}

export interface TicketDetails {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  assignee: TicketAssignee;
  createdAtUtc: string;
  updatedAtUtc: string | null;
}


export interface ProjectAssignee {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}




