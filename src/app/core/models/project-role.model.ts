export const ProjectRole = {
  Owner: 1,
  Member: 5,
  Viewer: 10,
} as const;

export type ProjectRole = typeof ProjectRole[keyof typeof ProjectRole];
