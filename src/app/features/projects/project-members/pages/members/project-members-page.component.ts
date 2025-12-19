import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-project-members-page',
  standalone: true,
  templateUrl: './project-members-page.component.html',
  styleUrl: './project-members-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectMembersPageComponent {}

