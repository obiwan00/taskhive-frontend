import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {PagedResult} from '@core/models';
import {GetMyTicketsQuery, MyTicket} from '../models';
import {toHttpParams} from '@core/utils';


@Injectable({
  providedIn: 'root'
})
export class MyTicketsApiService {
  private readonly http = inject(HttpClient);

  getPagedList(query?: GetMyTicketsQuery) {
    return this.http.get<PagedResult<MyTicket>>('/api/me/tickets', {params: toHttpParams(query)});
  }
}

