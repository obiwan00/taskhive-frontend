import { Routes } from '@angular/router';

import { MyTicketsPageComponent } from './tickets/pages/my-tickets-page/my-tickets-page.component';

export const myTicketsRoutes: Routes = [
  {
    path: '',
    component: MyTicketsPageComponent,
  }
];

