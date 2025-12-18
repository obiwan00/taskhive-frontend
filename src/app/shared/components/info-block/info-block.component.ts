import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
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
  imports: [MatIconModule],
  host: {
    '[class]': 'infoBlockClass()'
  }
})
export class InfoBlockComponent {
  type = input<InfoBlockType>('info');

  protected infoBlockClass = computed(() => `info-block info-block--${this.type()}`);
  protected icon = computed(() => ICON_MAP[this.type()]);
}

