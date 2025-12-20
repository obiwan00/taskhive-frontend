import { ProjectAssignee } from '../models';

export interface ProjectAssigneesState {
  assignees: ProjectAssignee[] | null;
  loading: boolean;
  error: unknown | null;
}
