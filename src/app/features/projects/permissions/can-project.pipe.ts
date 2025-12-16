import { Pipe, PipeTransform, inject } from '@angular/core';
import { ProjectRole } from '@core/models';
import { ProjectPermission } from './project-permission.model';
import { ProjectPermissionService } from './project-permission.service';

@Pipe({
  name: 'canProject',
  pure: true
})
export class CanProjectPipe implements PipeTransform {
  private readonly permissionService = inject(ProjectPermissionService);

  transform(role: ProjectRole, permission: ProjectPermission): boolean {
    return this.permissionService.hasPermission(role, permission);
  }
}

