import { inject, Pipe, PipeTransform } from '@angular/core';

import { ProjectRole } from '../../models';
import { ProjectPermission } from '../models';
import { ProjectPermissionService } from '../services';

@Pipe({
  name: 'canProject',
  pure: true,
  standalone: true
})
export class CanProjectPipe implements PipeTransform {
  private readonly permissionService = inject(ProjectPermissionService);

  transform(role: ProjectRole | null | undefined, permission: ProjectPermission): boolean {
    if (!role) return false;

    return this.permissionService.hasPermission(role, permission);
  }
}

