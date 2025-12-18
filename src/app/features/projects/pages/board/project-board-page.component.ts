import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-project-board-page',
  standalone: true,
  templateUrl: './project-board-page.component.html',
  styleUrl: './project-board-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectBoardPageComponent {}

