import { Routes } from '@angular/router';

import { AppLayoutComponent, AuthLayoutComponent } from '@layouts';

import { authenticatedGuard, unauthenticatedGuard } from '@core/auth';
import { desktopOnlyGuard, unsupportedScreenOnlyGuard } from '@core/guards';
import { loadUserProfileGuard } from '@core/user';

export const routes: Routes = [
  {
    path: 'unsupported-screen',
    canActivate: [unsupportedScreenOnlyGuard],
    loadChildren: () => import('./features/unsupported-screen/unsupported-screen.routes').then(m => m.unsupportedScreenRoutes),
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [unauthenticatedGuard, desktopOnlyGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes),
      },
    ]
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [authenticatedGuard, loadUserProfileGuard, desktopOnlyGuard],
    children: [
      {
        path: 'my-tickets',
        loadChildren: () => import('./features/projects/my-tickets/my-tickets.routes').then(m => m.myTicketsRoutes),
      },
      {
        path: 'projects',
        loadChildren: () => import('./features/projects/projects.routes').then(m => m.projectsRoutes),
      },
      {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full',
      }
    ]
  },
  { path: '**', redirectTo: 'auth', pathMatch: 'full' },
];
