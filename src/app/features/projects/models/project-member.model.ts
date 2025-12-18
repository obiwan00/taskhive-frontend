import { ProjectRole } from '@core/models';

export interface AddProjectMember {
  email: string;
  role: ProjectRole;
}

export interface UpdateProjectMember {
  role: ProjectRole;
}

export interface ProjectMember {
  role: ProjectRole;
  user: ProjectMemberUser;
  createdAtUtc: string;
  updatedAtUtc: string | null;
}

export interface ProjectMemberUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}




