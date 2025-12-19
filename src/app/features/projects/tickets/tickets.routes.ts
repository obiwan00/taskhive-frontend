import { Routes } from '@angular/router';

export const ticketsRoutes: Routes = [
  {
    path: ':ticketId',
    loadComponent: () => import('./pages/ticket-details/ticket-details-page.component').then(m => m.TicketDetailsPageComponent),
  }
];

