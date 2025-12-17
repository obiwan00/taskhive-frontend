import { Routes } from '@angular/router';
import { AuthLayoutComponent, AppLayoutComponent } from '@layouts';
import {authenticatedGuard, unauthenticatedGuard} from '@features/auth';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [unauthenticatedGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
      },
    ]
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [authenticatedGuard],
    children: [
      {
        path: 'profile',
        loadChildren: () => import('./features/profile/profile.routes').then(m => m.profileRoutes)
      },
      {
        path: 'my-tickets',
        loadChildren: () => import('./features/my-tickets/my-tickets.routes').then(m => m.myTicketsRoutes)
      },
      {
        path: 'projects',
        loadChildren: () => import('./features/projects/projects.routes').then(m => m.projectsRoutes),
      },
      {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full'
      }
    ]
  },
  { path: '**', redirectTo: 'auth', pathMatch: 'full' },
];
