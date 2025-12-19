import { Injectable } from '@angular/core';


import { ProjectRole } from '../../project/models/project-role.model';
import { projectPermissionMapping, ProjectPermission } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProjectPermissionService {
  hasPermission(role: ProjectRole, permission: ProjectPermission): boolean {
    const permissions = projectPermissionMapping[role];
    return permissions.includes(permission);
  }

  hasAnyPermission(role: ProjectRole, permissions: ProjectPermission[]): boolean {
    return permissions.some(permission => this.hasPermission(role, permission));
  }

  hasAllPermissions(role: ProjectRole, permissions: ProjectPermission[]): boolean {
    return permissions.every(permission => this.hasPermission(role, permission));
  }

  getPermissions(role: ProjectRole): ProjectPermission[] {
    return projectPermissionMapping[role];
  }
}

