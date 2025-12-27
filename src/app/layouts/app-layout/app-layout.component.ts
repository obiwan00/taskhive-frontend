import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { GlobalLoaderComponent } from '@shared/ui';

import { AppFooterComponent } from './footer/app-footer.component';
import { AppHeaderComponent } from './header/app-header.component';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, AppHeaderComponent, AppFooterComponent, GlobalLoaderComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppLayoutComponent {}
