import { Team } from './api-models';

export interface Profile {
  userId?: string;
  email?: string;
  team?: Team;
}
