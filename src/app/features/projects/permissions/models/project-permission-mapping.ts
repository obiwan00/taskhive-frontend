import { ProjectRole } from '@features/projects/project';

import { ProjectPermission } from './project-permission.model';

export const projectPermissionMapping: Record<ProjectRole, ProjectPermission[]> = {
  [ProjectRole.Owner]: Object.values(ProjectPermission),
  [ProjectRole.Member]: [
    ProjectPermission.ViewProjectDetails,

    ProjectPermission.ViewTickets,
    ProjectPermission.ViewTicketDetails,
    ProjectPermission.CreateTicket,
    ProjectPermission.UpdateTicket,
    ProjectPermission.AssignableToTicket,

    ProjectPermission.ViewProjectMembers,
    ProjectPermission.ViewProjectMemberDetails,
    ProjectPermission.ViewProjectAssignees,
  ],
  [ProjectRole.Viewer]: [
    ProjectPermission.ViewProjectDetails,
    ProjectPermission.ViewTickets,
    ProjectPermission.ViewTicketDetails,
  ],
} as const;

