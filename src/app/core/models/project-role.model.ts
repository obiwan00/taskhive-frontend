export const ProjectRole = {
  Owner: 1,
  Member: 5,
  Viewer: 10,
} as const;

export type ProjectRole = typeof ProjectRole[keyof typeof ProjectRole];

export const PROJECT_ROLE_LABELS: Record<ProjectRole, string> = {
  [ProjectRole.Owner]: 'Owner',
  [ProjectRole.Member]: 'Member',
  [ProjectRole.Viewer]: 'Viewer',
};

