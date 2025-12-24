import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';

import { distinctUntilChanged } from 'rxjs';

import { AuthService } from '@core/auth';
import { ScreenSizeService } from '@core/services';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {
  private router = inject(Router);
  private screenSizeService = inject(ScreenSizeService);
  private authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.subscribeForScreenSizeChanges();
  }

  private subscribeForScreenSizeChanges(): void {
    this.screenSizeService.isDesktopSize$()
      .pipe(
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((isDesktop) => {
        if (!isDesktop) {
          this.router.navigate(['/unsupported-screen']);
        } else {
          const isAuthenticated = this.authService.isLoggedIn();
          const targetRoute = isAuthenticated ? '/app' : '/auth';
          this.router.navigate([targetRoute]);
        }
      });
  }
}
