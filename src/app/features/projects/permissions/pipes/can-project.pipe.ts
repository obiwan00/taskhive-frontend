import { Pipe, PipeTransform, inject } from '@angular/core';

import { ProjectRole } from '@features/projects/shared';

import { ProjectPermission } from '../models';
import { ProjectPermissionService } from '../services';

@Pipe({
  name: 'canProject',
  pure: true,
  standalone: true
})
export class CanProjectPipe implements PipeTransform {
  private readonly permissionService = inject(ProjectPermissionService);

  transform(role: ProjectRole, permission: ProjectPermission): boolean {
    return this.permissionService.hasPermission(role, permission);
  }
}

