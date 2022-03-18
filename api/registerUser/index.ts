import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import userService from '../services/user.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const { email, password, firstName, lastName, team } = req.body;
  try {
    const newUser = await userService.register(email, password, firstName, lastName, team);
    if (newUser) {
      context.res = {
        statu: '201',
        body: newUser,
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
