import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import teamService from '../services/team.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const teamId = context.req.params.id;
    if (teamId) {
      const team = await teamService.delete(teamId);
      if (team) {
        context.res = {
          // status: 200, /* Defaults to 200 */
        };
      } else {
        context.res = {
          status: 404,
          body: {
            message: `Team not found with ID = ${teamId}`,
          },
        };
      }
    } else {
      const cnt = await teamService.deleteAll();
      const message = cnt > 1 ? `${cnt} teams were deleted` : `${cnt} team was deleted`;
      context.res = {
        // status: 200, /* Defaults to 200 */
        body: { message },
      };
    }
  } catch (err) {
    context.log.error(err);
    context.res = {
      status: 500,
      body: err,
    };
  }
};

export default httpTrigger;
