import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { User } from '../models/user.model';
import userService from '../services/user.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const userId = context.req.params.id;
    const user: Partial<User> = context.req.body;
    if (!userId) {
      context.res = {
        status: 400,
        body: 'User ID is required',
      };
      return;
    }
    if (!user) {
      context.res = {
        status: 400,
        body: 'User data is required',
      };
      return;
    }
    const updatedUser = await userService.update(userId, user);
    if (updatedUser) {
      context.res = {
        statu: '200',
        body: updatedUser,
      };
    } else {
      context.res = {
        status: 404,
        body: { message: 'User not found' },
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
