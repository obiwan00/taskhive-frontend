import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ListResult } from '@shared/models';

import { ProjectAssignee } from '../models';


@Injectable({
  providedIn: 'root'
})
export class ProjectsAssigneesApiService {
  private readonly http = inject(HttpClient);

  getList(projectId: string) {
    return this.http.get<ListResult<ProjectAssignee>>(`/api/projects/${projectId}/assignees`);
  }
}

