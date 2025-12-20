import { ProjectDetails } from '../models';

export interface ProjectState {
  project: ProjectDetails | null;
  loading: boolean;
  error: unknown | null;
}
