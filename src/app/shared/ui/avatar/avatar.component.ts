import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'avatar'
  }
})
export class AvatarComponent {
  firstName = input.required<string>();
  lastName = input.required<string>();

  protected readonly initials = computed(() => {
    const first = this.firstName().charAt(0).toUpperCase();
    const last = this.lastName().charAt(0).toUpperCase();
    return `${first}${last}`;
  });
}

