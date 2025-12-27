import { Routes } from '@angular/router';

import { ProjectAssigneesStateService } from '@features/projects/assignees';
import { ProjectPermission, projectPermissionGuard, ProjectStateService } from '@features/projects/project';

import { ProjectsListPageComponent } from './project/pages/projects-list/projects-list-page.component';
import { ProjectBoardPageComponent } from './tickets/pages/board/project-board-page.component';
import { TicketDetailsPageComponent } from './tickets/pages/ticket-details/ticket-details-page.component';


export const projectsRoutes: Routes = [
  {
    path: 'list',
    component: ProjectsListPageComponent
  },
  {
    path: ':projectId',
    providers: [ProjectStateService, ProjectAssigneesStateService],
    children: [
      {
        path: 'board',
        canActivate: [projectPermissionGuard([ProjectPermission.ViewProjectDetails, ProjectPermission.ViewTickets])],
        component: ProjectBoardPageComponent
      },
      {
        path: 'tickets/:ticketId',
        canActivate: [projectPermissionGuard([ProjectPermission.ViewTicketDetails])],
        component: TicketDetailsPageComponent,
      },
      {
        path: 'members',
        canActivate: [projectPermissionGuard([ProjectPermission.ViewProjectMembers])],
        loadComponent: () => import('./members/pages/members/project-members-page.component').then(m => m.ProjectMembersPageComponent)
      },
      {
        path: '',
        redirectTo: 'board',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  }
];

