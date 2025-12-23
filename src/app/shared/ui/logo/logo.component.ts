import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'logo'
  }
})
export class LogoComponent {
  size = input<'small' | 'medium' | 'large'>('medium');
}

