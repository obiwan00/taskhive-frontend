import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '@features/auth';

@Component({
  selector: 'app-app-header',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {
  private readonly authService = inject(AuthService);

  protected logout() {
    this.authService.logout();
  }
}
