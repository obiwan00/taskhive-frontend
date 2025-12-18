import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { ListResult } from '@core/models';

import { AddProjectMember, ProjectMember, UpdateProjectMember } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProjectMembersApiService {
  private readonly http = inject(HttpClient);

  getList(projectId: string) {
    return this.http.get<ListResult<ProjectMember>>(`/api/projects/${projectId}/members`);
  }

  getDetails(projectId: string, userId: string) {
    return this.http.get<ProjectMember>(`/api/projects/${projectId}/members/${userId}`);
  }

  add(projectId: string, data: AddProjectMember) {
    return this.http.post<void>(`/api/projects/${projectId}/members`, data);
  }

  update(projectId: string, userId: string, data: UpdateProjectMember) {
    return this.http.patch<void>(`/api/projects/${projectId}/members/${userId}`, data);
  }

  remove(projectId: string, userId: string) {
    return this.http.delete<void>(`/api/projects/${projectId}/members/${userId}`);
  }
}

