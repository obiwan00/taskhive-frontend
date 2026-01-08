import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MIN_DESKTOP_WIDTH, PROJECT_GITHUB_REPO } from '@core/tokens';
import { LogoComponent } from '@shared/ui';

@Component({
  selector: 'app-unsupported-screen-page',
  imports: [LogoComponent],
  templateUrl: './unsupported-screen-page.component.html',
  styleUrl: './unsupported-screen-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnsupportedScreenPage {
  protected readonly MIN_DESKTOP_WIDTH = inject(MIN_DESKTOP_WIDTH);
  protected readonly PROJECT_GITHUB_REPO = inject(PROJECT_GITHUB_REPO);
}

