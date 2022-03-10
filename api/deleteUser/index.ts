import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import userService from '../services/user.service';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const userId = context.req.params.id;
    if (!userId) {
      context.res = {
        status: 400,
        body: 'User ID is required',
      };
      return;
    }
    const updatedUser = await userService.delete(userId);
    if (updatedUser) {
      context.res = {
        status: '200',
        body: { message: 'User is deleted' },
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
