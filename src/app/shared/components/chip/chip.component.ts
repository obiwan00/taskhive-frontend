import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ChipType = 'green' | 'red' | 'blue' | 'yellow' | 'purple' | 'gray';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'chipClass()'
  }
})
export class ChipComponent {
  type = input<ChipType>('gray');

  protected chipClass = computed(() => `chip chip--${this.type()}`);
}

