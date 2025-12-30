import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '@environments/environment';

import { PagedResult } from '@shared/models';
import { toHttpParams } from '@shared/utils';

import { CreateTicket, GetTicketsQuery, TicketBrief, TicketDetails, UpdateTicket } from '../models';


@Injectable({
  providedIn: 'root'
})
export class TicketsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  getPagedList(projectId: string, query?: GetTicketsQuery) {
    return this.http.get<PagedResult<TicketBrief>>(`${this.apiBaseUrl}/api/projects/${projectId}/tickets`, { params: toHttpParams(query) });
  }

  getDetails(projectId: string, ticketId: string) {
    return this.http.get<TicketDetails>(`${this.apiBaseUrl}/api/projects/${projectId}/tickets/${ticketId}`);
  }

  create(projectId: string, data: CreateTicket) {
    return this.http.post<TicketBrief>(`${this.apiBaseUrl}/api/projects/${projectId}/tickets`, data);
  }

  update(projectId: string, ticketId: string, data: UpdateTicket) {
    return this.http.patch<void>(`${this.apiBaseUrl}/api/projects/${projectId}/tickets/${ticketId}`, data);
  }

  delete(projectId: string, ticketId: string) {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/projects/${projectId}/tickets/${ticketId}`);
  }
}
