export const TicketStatus = {
  Todo: 0,
  InProgress: 5,
  Done: 10,
} as const;

export type TicketStatus = typeof TicketStatus[keyof typeof TicketStatus];
