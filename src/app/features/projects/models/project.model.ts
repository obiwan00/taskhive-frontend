import {PaginationQuery, ProjectRole} from '@core/models';

export interface GetProjectsQuery extends PaginationQuery {
  search?: string;
}

export interface CreateProject {
  title: string;
  description: string;
}

export interface UpdateProject {
  title?: string;
  description?: string;
}

export interface ProjectBrief {
  id: string;
  myRole: ProjectRole;
  title: string;
  description: string;
  createdAtUtc: string;
  updatedAtUtc: string | null;
}

export interface ProjectDetails {
  id: string;
  myRole: ProjectRole;
  title: string;
  description: string;
  createdAtUtc: string;
  updatedAtUtc: string | null;
}



