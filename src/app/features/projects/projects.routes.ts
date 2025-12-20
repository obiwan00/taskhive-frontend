import { Routes } from '@angular/router';

import { ProjectAssigneesStateService } from '@features/projects/assignees';
import { ProjectStateService } from '@features/projects/project';

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
        component: ProjectBoardPageComponent
      },
      {
        path: 'tickets/:ticketId',
        component: TicketDetailsPageComponent,
      },
      {
        path: 'members',
        loadChildren: () => import('./members/project-members.routes').then(m => m.projectMembersRoutes)
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

