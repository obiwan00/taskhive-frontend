import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '@environments/environment';

import { ListResult } from '@shared/models';

import { ProjectAssignee } from '../models';


@Injectable({
  providedIn: 'root'
})
export class ProjectsAssigneesApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  getList(projectId: string) {
    return this.http.get<ListResult<ProjectAssignee>>(`${this.apiBaseUrl}/api/projects/${projectId}/assignees`);
  }
}

