import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '@core/auth';
import { AppNavRoutes } from '@core/navigation-routes';
import { UserService } from '@core/user';
import { LogoComponent, UserInfoComponent } from '@shared/ui';

@Component({
  selector: 'app-app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    LogoComponent,
    UserInfoComponent
  ],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);

  protected readonly AppNavRoutes = AppNavRoutes;

  protected readonly userProfile = this.userService.profile;

  protected logout(): void {
    this.authService.logout();
  }
}
