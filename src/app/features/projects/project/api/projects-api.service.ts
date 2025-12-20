import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { PagedResult } from '@shared/models';
import { toHttpParams } from '@shared/utils';

import {
  CreateProject,
  GetProjectsQuery,
  ProjectBrief,
  ProjectDetails,
  UpdateProject
} from '../models';


@Injectable({
  providedIn: 'root'
})
export class ProjectsApiService {
  private readonly http = inject(HttpClient);

  getPagedList(query?: GetProjectsQuery) {
    return this.http.get<PagedResult<ProjectBrief>>(`/api/projects`, { params: toHttpParams(query) });
  }

  getDetails(projectId: string) {
    return this.http.get<ProjectDetails>(`/api/projects/${projectId}`);
  }

  create(data: CreateProject) {
    return this.http.post<ProjectBrief>(`/api/projects`, data);
  }

  update(projectId: string, data: UpdateProject) {
    return this.http.patch<void>(`/api/projects/${projectId}`, data);
  }

  delete(projectId: string) {
    return this.http.delete<void>(`/api/projects/${projectId}`);
  }
}

