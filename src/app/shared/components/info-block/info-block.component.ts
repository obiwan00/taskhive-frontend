import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

type InfoBlockType = 'info' | 'error';

const ICON_MAP: Record<InfoBlockType, string> = {
  info: 'info',
  error: 'error',
};

@Component({
  selector: 'app-info-block',
  templateUrl: './info-block.component.html',
  styleUrl: './info-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
})
export class InfoBlockComponent {
  type = input<InfoBlockType>('info');

  get icon(): string {
    return ICON_MAP[this.type()];
  }
}

