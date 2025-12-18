import {Component, inject} from '@angular/core';
import {AuthService} from '@features/auth';
import {RouterLink, RouterLinkActive} from '@angular/router';

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
