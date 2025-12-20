export const ProjectPermission = {
  ViewProjectDetails: 1,
  UpdateProject: 5,
  DeleteProject: 10,

  ViewTickets: 15,
  ViewTicketDetails: 20,
  CreateTicket: 25,
  UpdateTicket: 30,
  DeleteTicket: 35,
  AssignableToTicket: 40,

  ViewProjectMembers: 45,
  ViewProjectMemberDetails: 50,
  ViewProjectAssignees: 55,
  AddProjectMember: 60,
  UpdateProjectMemberRole: 65,
  RemoveProjectMember: 70,
} as const;

export type ProjectPermission = typeof ProjectPermission[keyof typeof ProjectPermission];

