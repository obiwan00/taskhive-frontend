import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '@core/auth';

@Component({
  selector: 'app-app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule
  ],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {
  private readonly authService = inject(AuthService);

  protected logout(): void {
    this.authService.logout();
  }
}
