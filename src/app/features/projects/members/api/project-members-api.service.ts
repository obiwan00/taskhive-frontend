import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { environment } from '@environments/environment';

import { ListResult } from '@shared/models';

import { AddProjectMember, ProjectMember, UpdateProjectMember } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProjectMembersApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  getList(projectId: string) {
    return this.http.get<ListResult<ProjectMember>>(`${this.apiBaseUrl}/api/projects/${projectId}/members`);
  }

  getDetails(projectId: string, userId: string) {
    return this.http.get<ProjectMember>(`${this.apiBaseUrl}/api/projects/${projectId}/members/${userId}`);
  }

  add(projectId: string, data: AddProjectMember) {
    return this.http.post<void>(`${this.apiBaseUrl}/api/projects/${projectId}/members`, data);
  }

  update(projectId: string, userId: string, data: UpdateProjectMember) {
    return this.http.patch<void>(`${this.apiBaseUrl}/api/projects/${projectId}/members/${userId}`, data);
  }

  remove(projectId: string, userId: string) {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/projects/${projectId}/members/${userId}`);
  }
}

