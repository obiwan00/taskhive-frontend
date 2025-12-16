import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
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
  // TODO redirect empty path to 'app' or 'auth' based on authentication status
  { path: '**', redirectTo: 'auth', pathMatch: 'full' },
];
