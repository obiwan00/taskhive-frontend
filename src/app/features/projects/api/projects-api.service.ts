import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { ListResult, PagedResult } from '@core/models';
import { toHttpParams } from '@core/utils';

import { CreateProject, GetProjectsQuery, ProjectAssignee, ProjectBrief, ProjectDetails, UpdateProject } from '../models';


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

  getAssignees(projectId: string) {
    return this.http.get<ListResult<ProjectAssignee>>(`/api/projects/${projectId}/assignees`);
  }

  create(data: CreateProject) {
    return this.http.post<ProjectBrief>(`/api/projects`, data);
  }

  update(projectId: string, data: UpdateProject) {
    return this.http.patch<ProjectDetails>(`/api/projects/${projectId}`, data);
  }

  delete(projectId: string) {
    return this.http.delete<void>(`/api/projects/${projectId}`);
  }
}

