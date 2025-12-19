export const TicketStatus = {
  Todo: 0,
  InProgress: 5,
  Done: 10,
} as const;

export type TicketStatus = typeof TicketStatus[keyof typeof TicketStatus];

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  [TicketStatus.Todo]: 'To Do',
  [TicketStatus.InProgress]: 'In Progress',
  [TicketStatus.Done]: 'Done',
};

