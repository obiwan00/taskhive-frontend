import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GlobalLoaderService } from '@core/services';

@Component({
  selector: 'app-global-loader',
  templateUrl: './global-loader.component.html',
  styleUrl: './global-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinnerModule]
})
export class GlobalLoaderComponent {
  private readonly loaderService = inject(GlobalLoaderService);

  protected readonly isLoading = this.loaderService.isLoading;
}

