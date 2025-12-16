import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-ticket-details-page',
  standalone: true,
  templateUrl: './ticket-details-page.component.html',
  styleUrl: './ticket-details-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketDetailsPageComponent {}

