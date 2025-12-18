import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-my-ticket-page',
  standalone: true,
  templateUrl: './my-tickets-page.component.html',
  styleUrl: './my-tickets-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyTicketsPageComponent {}
