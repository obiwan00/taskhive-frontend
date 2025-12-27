export const AppNavRoutes = {
  authRoot: '/auth',
  auth: {
    login: '/auth/login',
    register: '/auth/register'
  },

  appRoot: '/app',

  projectsRoot: '/app/projects',
  projects: {
    list: '/app/projects/list',
    board: (projectId: string) => `/app/projects/${projectId}/board`,
    ticketDetails: (projectId: string, ticketId: string) => `/app/projects/${projectId}/tickets/${ticketId}`,
    members: (projectId: string) => `/app/projects/${projectId}/members`
  },

  myTickets: '/app/my-tickets',
} as const;
