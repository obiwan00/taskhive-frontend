import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn, Router } from '@angular/router';

import { map } from 'rxjs';

import { AppNavRoutes } from '@core/navigation-routes';

import { ProjectStateService } from '../../state';
import { ProjectPermission } from '../models';
import { ProjectPermissionService } from '../services';


export interface ProjectPermissionGuardData {
  requireAllPermissions: boolean;
}

export const projectPermissionGuard = (permissions: ProjectPermission[]): CanActivateFn =>
  (route) => {
    const projectStateService = inject(ProjectStateService);
    const permissionService = inject(ProjectPermissionService);
    const router = inject(Router);
    const snackBar = inject(MatSnackBar);

    const projectId = route.paramMap.get('projectId');

    if (!projectId) {
      throw new Error('Project ID is required in route parameters for ProjectPermissionGuard');
    }

    const { requireAllPermissions = true } = route.data as ProjectPermissionGuardData;


    return projectStateService.init(projectId).pipe(
      map(() => {
        const project = projectStateService.project();

        if (!project) {
          throw new Error('Project not initialized');
        }

        const hasPermission = requireAllPermissions
          ? permissionService.hasAllPermissions(project.myRole, permissions)
          : permissionService.hasAnyPermission(project.myRole, permissions);

        if (hasPermission) {
          return true;
        }

        snackBar.open('You do not have permission to access this page');

        return router.createUrlTree([AppNavRoutes.projects.list]);
      })
    );
  };
