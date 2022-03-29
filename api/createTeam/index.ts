import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { Team } from '../models/team.model';
import teamService from '../services/team.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const body = req.body;
  let cnt = 0;

  try {
    if (Array.isArray(body)) {
      for (const team of body) {
        await teamService.create(team);
        cnt++;
      }
    } else {
      const team: Team = req.body;
      await teamService.create(team);
      cnt++;
    }

    if (cnt > 0) {
      const message = cnt > 1 ? `${cnt} teams were created` : `${cnt} team was created`;
      context.res = {
        statu: '201',
        body: { message },
      };
    } else {
      context.res = {
        status: 500,
        body: { message: 'Failed to crate a record.' },
      };
    }
  } catch (err: any) {
    context.log.error(err);
    context.res = {
      status: 500,
      body: err,
    };
  }
};

export default httpTrigger;
