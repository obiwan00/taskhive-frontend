import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { AvatarComponent } from '../avatar';
import { CopyTextComponent } from '../copy-text';

@Component({
  selector: 'app-user-info-overlay',
  templateUrl: './user-info-overlay.component.html',
  styleUrl: './user-info-overlay.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent, CopyTextComponent],
  host: {
    class: 'user-info-overlay'
  }
})
export class UserInfoOverlayComponent {
  firstName = input.required<string>();
  lastName = input.required<string>();
  email = input.required<string>();
}

