import {Routes} from '@angular/router';
import {ProjectsListPageComponent} from './pages/projects-list/projects-list-page.component';
import {ProjectBoardPageComponent} from './pages/board/project-board-page.component';
import {ProjectMembersPageComponent} from './pages/members/project-members-page.component';
import {TicketDetailsPageComponent} from './pages/ticket-details/ticket-details-page.component';

export const projectsRoutes: Routes = [
  {
    path: 'list',
    component: ProjectsListPageComponent
  },
  {
    path: ':projectId',
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
        component: ProjectMembersPageComponent
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

