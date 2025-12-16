import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-projects-list-page',
  standalone: true,
  templateUrl: './projects-list-page.component.html',
  styleUrl: './projects-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsListPageComponent {}

