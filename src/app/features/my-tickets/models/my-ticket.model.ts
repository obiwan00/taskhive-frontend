import {TicketStatus} from '@core/models';

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
