import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { Team } from '../models/team.model';
import teamService from '../services/team.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const team: Partial<Team> = req.body;
  const teamId = context.req.params.id;
  if (teamId) {
    try {
      const teamUpdated = await teamService.update(teamId, team);
      if (teamUpdated) {
        context.res = {
          status: 200,
          body: {
            message: 'Survey updated',
          },
        };
      } else {
        context.res = {
          status: 404,
          body: {
            message: 'Team not found',
          },
        };
      }
    } catch (err: any) {
      context.log.error(err);
      context.res = {
        status: 500,
        body: err,
      };
    }
  }
};

export default httpTrigger;
