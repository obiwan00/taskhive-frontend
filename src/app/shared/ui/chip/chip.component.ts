import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ChipColor = 'green' | 'red' | 'blue' | 'yellow' | 'purple' | 'gray';
export type ChipRoundingType = 'light' | 'full';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'chipClass()',
  }
})
export class ChipComponent {
  color = input<ChipColor>('gray');
  roundingType = input<ChipRoundingType>('light');

  protected chipClass = computed(() =>
    `chip chip--${this.color()} chip--rounded-${this.roundingType()}`
  );
}

