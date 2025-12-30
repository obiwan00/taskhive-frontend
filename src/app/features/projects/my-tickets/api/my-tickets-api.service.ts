import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '@environments/environment';

import { PagedResult } from '@shared/models';
import { toHttpParams } from '@shared/utils';

import { GetMyTicketsQuery, MyTicket } from '../models';


@Injectable({
  providedIn: 'root'
})
export class MyTicketsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  getPagedList(query?: GetMyTicketsQuery) {
    return this.http.get<PagedResult<MyTicket>>(`${this.apiBaseUrl}/api/me/tickets`, { params: toHttpParams(query) });
  }
}

