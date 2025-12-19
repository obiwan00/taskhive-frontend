import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { ChipColor, ChipComponent } from '@shared/ui';

import { TICKET_STATUS_LABELS, TicketStatus } from '../../models';


const TICKET_STATUS_COLORS: Record<TicketStatus, ChipColor> = {
  [TicketStatus.Done]: 'green',
  [TicketStatus.InProgress]: 'blue',
  [TicketStatus.Todo]: 'gray',
};

@Component({
  selector: 'app-ticket-status',
  imports: [ChipComponent],
  templateUrl: './ticket-status.component.html',
  styleUrl: './ticket-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketStatusComponent {
  status = input.required<TicketStatus>();

  protected chipColor = computed(() => TICKET_STATUS_COLORS[this.status()]);
  protected statusLabel = computed(() => TICKET_STATUS_LABELS[this.status()]);
}

