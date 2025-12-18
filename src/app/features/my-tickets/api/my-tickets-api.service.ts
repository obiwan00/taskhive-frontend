import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { PagedResult } from '@core/models';
import { toHttpParams } from '@core/utils';

import { GetMyTicketsQuery, MyTicket } from '../models';


@Injectable({
  providedIn: 'root'
})
export class MyTicketsApiService {
  private readonly http = inject(HttpClient);

  getPagedList(query?: GetMyTicketsQuery) {
    return this.http.get<PagedResult<MyTicket>>('/api/me/tickets', { params: toHttpParams(query) });
  }
}

