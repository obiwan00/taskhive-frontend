import { Routes } from '@angular/router';


export const projectMembersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/members/project-members-page.component').then(m => m.ProjectMembersPageComponent),
  }
];

