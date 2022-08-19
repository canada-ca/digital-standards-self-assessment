import { JobTitle, Team } from './api-models';

export interface Profile {
  userId?: string;
  jobTitle?: JobTitle;
  team?: Team;
  timeInPosition?: string;
}
