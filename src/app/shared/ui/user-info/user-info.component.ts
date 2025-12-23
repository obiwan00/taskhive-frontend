import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { HoverOverlayDirective } from '@shared/directives';

import { AvatarComponent } from '../avatar';
import { CopyTextComponent } from '../copy-text';
import { UserInfoOverlayComponent } from '../user-info-overlay';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AvatarComponent,
    CopyTextComponent,
    UserInfoOverlayComponent,
    HoverOverlayDirective
  ],
  host: {
    class: 'user-info'
  }
})
export class UserInfoComponent {
  firstName = input.required<string>();
  lastName = input.required<string>();
  email = input.required<string>();
  showEmail = input<boolean>(false);
  showDetailsOverlay = input<boolean>(true);
}

